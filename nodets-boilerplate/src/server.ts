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
        return 'Error fetching Service2 info';
    }
};

// Endpoint to get system information
app.get('/system-info', async (req, res) => {
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

        // Construct HTML response
        const htmlResponse = `
      <html>
        <head>
          <title>System Information</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            pre { background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; white-space: pre-wrap; word-wrap: break-word; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Service1 Information</h1>
          <table>
            <tr>
              <th>IP Address</th>
              <td>${service1Info.ip}</td>
            </tr>
            <tr>
              <th>Last Boot Time</th>
              <td>${service1Info.uptime}</td>
            </tr>
          </table>
          <h2>Running Processes (Service1)</h2>
          <pre>${service1Info.processes}</pre>
          <h2>Disk Space Information (Service1)</h2>
          <pre>${service1Info.diskSpace}</pre>
          
          <h1>Service2 Information</h1>
          <table>
            <tr>
              <th>IP Address</th>
              <td>${service2Info.ip}</td>
            </tr>
            <tr>
              <th>Last Boot Time</th>
              <td>${service2Info.uptime}</td>
            </tr>
          </table>
          <h2>Running Processes (Service2)</h2>
          <pre>${service2Info.processes}</pre>
          <h2>Disk Space Information (Service2)</h2>
          <pre>${service2Info.diskSpace}</pre>
        </body>
      </html>
    `;

        // Send HTML response
        return res.send(htmlResponse);
    } catch (error: any) {
        return res.status(500).json({ message: 'Unable to retrieve system information', error: error.message });
    }
});

app.listen(8199, () => {
    console.log('Server is running on port 8199');
});
