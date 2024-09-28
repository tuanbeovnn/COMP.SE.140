package com.dockercompose.docker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@SpringBootApplication
public class DockerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DockerApplication.class, args);
    }

    @GetMapping("/info")
    public Map<String, Object> getInfo() throws Exception {
        Map<String, Object> response = new HashMap<>();

        response.put("service", "Service2");
        response.put("ip", getIPAddress());
        response.put("processes", getProcesses());
        response.put("diskSpace", getDiskSpace());
        response.put("uptime", getUptime());
        return response;
    }

    private String getIPAddress() throws Exception {
        InetAddress inetAddress = InetAddress.getLocalHost();
        return inetAddress.getHostAddress();
    }

    private List<String> getProcesses() throws Exception {
        Process process = Runtime.getRuntime().exec("ps aux");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            return reader.lines().collect(Collectors.toList());
        }
    }

    private String getDiskSpace() throws Exception {
        Process process = Runtime.getRuntime().exec("df -h /");
        return new BufferedReader(new InputStreamReader(process.getInputStream())).lines().collect(Collectors.joining("\n"));
    }

    private String getUptime() throws Exception {
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime();
        return String.format("%d minutes", uptime / (1000 * 60));
    }
}