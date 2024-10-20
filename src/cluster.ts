import cluster from "cluster";
import os from "os";
import dotenv from 'dotenv';
import {loadBalancer} from "./loadBalancer";
import http from "http";
import {handleRequest} from "./services/handleRequest";

dotenv.config();

const port = process.env.PORT || 4000;
const workerPorts: number[] = [];

const cpus = os.cpus().length;

if (cluster.isPrimary) {
	for (let i = 0; i < cpus; i++) {
		const workerPort = +port + i + 1;
		workerPorts.push(workerPort);
		const worker = cluster.fork({ WORKER_PORT: workerPort.toString() });

		worker.on("message", (message) => {
			console.log(`[${worker.process.pid} to MASTER]`, message);
		});
	}

	loadBalancer(+port, workerPorts);
	cluster.on("exit", (worker) => {
		console.warn(`[${worker.process.pid}]`, {
			message: "Process terminated. Restarting.",
		});

		cluster.fork();
	});
} else {
	const workerPort = process.env.WORKER_PORT;
	// Worker process
	const server = http.createServer(handleRequest);

	server.listen(workerPort, () => {
		console.log(`Worker ${process.pid} is running on port ${workerPort}`);
	});
}
