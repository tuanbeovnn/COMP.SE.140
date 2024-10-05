import express from 'express';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';

const app = express();
const execAsync = promisify(exec);

// Function to get IP address
const getIPAddress = (): string => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName of Object.keys(networkInterfaces)) {
        const networkInterface = networkInterfaces[interfaceName];
        if (networkInterface) {
            for (const network of networkInterface) {
                if (network.family === 'IPv4' && !network.internal) {
                    return network.address;
                }
            }
        }
    }
    return 'No IP found';
};

// Function to get running processes
const getRunningProcesses = async (): Promise<string> => {
    try {
        const { stdout } = await execAsync('ps aux'); // Command for Unix/Linux/macOS
        return stdout;
    } catch (error) {
        return 'Unable to retrieve process list';
    }
};

// Function to get available disk space
const getDiskSpace = async (): Promise<string> => {
    try {
        const { stdout } = await execAsync('df -h'); // Command for Unix/Linux/macOS
        return stdout;
    } catch (error) {
        return 'Unable to retrieve disk space information';
    }
};

// Function to get uptime
const getUptime = (): string => {
    const uptimeInSeconds = os.uptime();
    const hours = Math.floor(uptimeInSeconds / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = uptimeInSeconds % 60;
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
};

// Function to get info from Service2
const getService2Info = async (): Promise<any> => {
    try {
        const response = await axios.get('http://service2:8080/info'); // Adjust the URL as needed
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Service2 info:', error.message);
        return { message: 'Error fetching Service2 info', error: error.message };
    }
};

// Endpoint to get system information
app.get('', async (req, res) => {
    try {
        const ipAddress = getIPAddress();
        const runningProcesses = await getRunningProcesses();
        const diskSpace = await getDiskSpace();
        const uptime = getUptime();

        // Create service1Info object
        const service1Info = {
            ip: ipAddress,
            processes: runningProcesses,
            diskSpace,
            uptime
        };

        // Fetch Service2 info
        const service2Info = await getService2Info();

        // Construct JSON response
        const jsonResponse = {
            service1: service1Info,
            service2: service2Info
        };

        // Send JSON response
        return res.json(jsonResponse);
    } catch (error: any) {
        return res.status(500).json({ message: 'Unable to retrieve system information', error: error.message });
    }
});

app.listen(8199, () => {
    console.log('Server is running on port 8199');
});
