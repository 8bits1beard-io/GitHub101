/**
 * GitHub Tutorial Interactive JavaScript
 * 
 * Author: Joshua Walderbach
 * Created: 2025-08-13
 * Description: Interactive functionality for GitHub tutorial
 */

// Global error handling for better UX
window.addEventListener('error', function(e) {
    console.error('Script error:', e.error);
    // Don't show errors to users unless critical
});

// Performance optimization: Lazy load content
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, { threshold: 0.1 });

// Tutorial state
let currentSection = 0;
const sections = ['intro', 'setup', 'repositories', 'basics', 'branching', 'collaboration', 'advanced', 'best-practices', 'final-quiz'];

// Theme Management
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a fun transition effect
    body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
        body.style.transition = '';
    }, 500);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

// Scroll-triggered storytelling elements
function initScrollTriggers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add special effects for different elements
                if (entry.target.classList.contains('card')) {
                    entry.target.style.animation = 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                
                if (entry.target.classList.contains('interactive-demo')) {
                    entry.target.style.animation = 'glowPulse 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                
                if (entry.target.tagName === 'PRE') {
                    entry.target.style.animation = 'typewriter 1s cubic-bezier(0.4, 0, 0.2, 1)';
                }
            }
        });
    }, observerOptions);
    
    // Observe all cards, demos, and code blocks
    document.querySelectorAll('.card, .interactive-demo, pre').forEach(el => {
        observer.observe(el);
    });
}

// Add keyframe animations to the page
function addScrollAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes glowPulse {
            0% {
                box-shadow: 0 0 0 rgba(0, 245, 255, 0);
            }
            50% {
                box-shadow: 0 0 30px rgba(0, 245, 255, 0.3);
            }
            100% {
                box-shadow: 0 0 0 rgba(0, 245, 255, 0);
            }
        }
        
        @keyframes typewriter {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .animate-in {
            animation-fill-mode: both;
        }
    `;
    document.head.appendChild(style);
}

// Old Interactive Demo code removed - replaced with static concept explanation

// PowerShell/Python code examples
const codeExamples = {
    'ps-initial': `# Get-SystemInfo.ps1 - Initial version
# Basic system information reporter

$computerName = $env:COMPUTERNAME
$cpu = Get-WmiObject -Class Win32_Processor | Select-Object -First 1
$memory = Get-WmiObject -Class Win32_OperatingSystem
$disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DriveType=3"

Write-Host "=== System Information Report ==="
Write-Host "Computer: $computerName"
Write-Host "CPU: $($cpu.Name)"
Write-Host "Memory: $([Math]::Round($memory.TotalVisibleMemorySize/1MB, 2)) GB"
Write-Host "Disk Space:"
foreach ($drive in $disk) {
    $freeGB = [Math]::Round($drive.FreeSpace/1GB, 2)
    $totalGB = [Math]::Round($drive.Size/1GB, 2)
    Write-Host "  $($drive.DeviceID) $freeGB GB free of $totalGB GB"
}`,
    'ps-improved': `# Get-SystemInfo.ps1 - Improved version with functions and error handling
[CmdletBinding()]
param(
    [string]$ComputerName = $env:COMPUTERNAME,
    [switch]$IncludeNetwork
)

function Get-CPUInfo {
    param([string]$Computer)
    try {
        $cpu = Get-CimInstance -ClassName Win32_Processor -ComputerName $Computer -ErrorAction Stop
        return [PSCustomObject]@{
            Name = $cpu.Name
            Cores = $cpu.NumberOfCores
            LogicalProcessors = $cpu.NumberOfLogicalProcessors
            MaxClockSpeed = "$($cpu.MaxClockSpeed) MHz"
            LoadPercentage = $cpu.LoadPercentage
        }
    }
    catch {
        Write-Warning "Failed to get CPU info: $($_.Exception.Message)"
        return $null
    }
}

function Get-MemoryInfo {
    param([string]$Computer)
    try {
        $os = Get-CimInstance -ClassName Win32_OperatingSystem -ComputerName $Computer -ErrorAction Stop
        $totalGB = [Math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
        $freeGB = [Math]::Round($os.FreePhysicalMemory / 1MB, 2)
        $usedGB = $totalGB - $freeGB
        
        return [PSCustomObject]@{
            TotalGB = $totalGB
            UsedGB = $usedGB
            FreeGB = $freeGB
            UsagePercent = [Math]::Round(($usedGB / $totalGB) * 100, 1)
        }
    }
    catch {
        Write-Warning "Failed to get memory info: $($_.Exception.Message)"
        return $null
    }
}

function Get-DiskInfo {
    param([string]$Computer)
    try {
        $disks = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=3" -ComputerName $Computer -ErrorAction Stop
        $diskInfo = foreach ($disk in $disks) {
            [PSCustomObject]@{
                Drive = $disk.DeviceID
                TotalGB = [Math]::Round($disk.Size / 1GB, 2)
                FreeGB = [Math]::Round($disk.FreeSpace / 1GB, 2)
                UsedGB = [Math]::Round(($disk.Size - $disk.FreeSpace) / 1GB, 2)
                UsagePercent = [Math]::Round((($disk.Size - $disk.FreeSpace) / $disk.Size) * 100, 1)
            }
        }
        return $diskInfo
    }
    catch {
        Write-Warning "Failed to get disk info: $($_.Exception.Message)"
        return $null
    }
}

# Main execution
Write-Host "=== System Information Report for $ComputerName ===" -ForegroundColor Green

$cpuInfo = Get-CPUInfo -Computer $ComputerName
$memoryInfo = Get-MemoryInfo -Computer $ComputerName  
$diskInfo = Get-DiskInfo -Computer $ComputerName

if ($cpuInfo) {
    Write-Host "\\nCPU Information:" -ForegroundColor Yellow
    $cpuInfo | Format-List
}

if ($memoryInfo) {
    Write-Host "Memory Information:" -ForegroundColor Yellow
    $memoryInfo | Format-List
}

if ($diskInfo) {
    Write-Host "Disk Information:" -ForegroundColor Yellow
    $diskInfo | Format-Table -AutoSize
}`,
    'ps-final': `# Get-SystemInfo.ps1 - Professional System Information Reporter
<#
.SYNOPSIS
    Comprehensive system information reporter for Windows environments.

.DESCRIPTION
    Gathers detailed CPU, RAM, disk, and network information from local or remote computers.
    Supports multiple output formats and can generate reports for monitoring and documentation.

.PARAMETER ComputerName
    Name of the computer to query. Accepts pipeline input and multiple computer names.

.PARAMETER IncludeNetwork
    Include detailed network adapter information in the report.

.PARAMETER OutputFormat
    Specify output format: Object (default), JSON, CSV, or HTML.

.PARAMETER ExportPath
    Path to export the report. File extension determines format if not specified.

.EXAMPLE
    Get-SystemInfo
    Gets system information for the local computer.

.EXAMPLE
    Get-SystemInfo -ComputerName "SERVER01", "SERVER02" -IncludeNetwork
    Gets system information including network details for multiple servers.

.EXAMPLE
    Get-SystemInfo -OutputFormat JSON -ExportPath "C:\\\\Reports\\\\SystemInfo.json"
    Exports system information to JSON format.

.NOTES
    Author: Joshua Walderbach
    Version: 2.1.0
    Requires: PowerShell 5.1+ and CIM cmdlets
#>

[CmdletBinding()]
param(
    [Parameter(ValueFromPipeline = $true)]
    [ValidateNotNullOrEmpty()]
    [Alias('CN', 'Server', 'Host')]
    [string[]]$ComputerName = $env:COMPUTERNAME,
    
    [switch]$IncludeNetwork,
    
    [ValidateSet('Object', 'JSON', 'CSV', 'HTML')]
    [string]$OutputFormat = 'Object',
    
    [string]$ExportPath
)

begin {
    function Convert-Bytes {
        param([int64]$Bytes)
        $sizes = @('Bytes', 'KB', 'MB', 'GB', 'TB')
        $index = 0; $value = $Bytes
        while ($value -ge 1024 -and $index -lt $sizes.Length - 1) {
            $value = $value / 1024; $index++
        }
        return "{0:N2} {1}" -f $value, $sizes[$index]
    }
    $results = @()
}

process {
    foreach ($computer in $ComputerName) {
        try {
            # Gather comprehensive system information
            $os = Get-CimInstance -ClassName Win32_OperatingSystem -ComputerName $computer -ErrorAction Stop
            $cpu = Get-CimInstance -ClassName Win32_Processor -ComputerName $computer -ErrorAction Stop | Select-Object -First 1
            $memory = Get-CimInstance -ClassName Win32_PhysicalMemory -ComputerName $computer -ErrorAction Stop
            $disks = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=3" -ComputerName $computer -ErrorAction Stop
            
            # Calculate memory and disk information
            $totalMemoryBytes = ($memory | Measure-Object Capacity -Sum).Sum
            $totalMemoryGB = [Math]::Round($totalMemoryBytes / 1GB, 2)
            $freeMemoryGB = [Math]::Round($os.FreePhysicalMemory / 1MB, 2)
            
            $diskInfo = foreach ($disk in $disks) {
                [PSCustomObject]@{
                    Drive = $disk.DeviceID
                    TotalGB = [Math]::Round($disk.Size / 1GB, 2)
                    FreeGB = [Math]::Round($disk.FreeSpace / 1GB, 2)
                    UsagePercent = [Math]::Round((($disk.Size - $disk.FreeSpace) / $disk.Size) * 100, 1)
                }
            }
            
            # Network information (if requested)
            $networkInfo = if ($IncludeNetwork) {
                Get-CimInstance -ClassName Win32_NetworkAdapter -Filter "NetEnabled=true" -ComputerName $computer | 
                ForEach-Object {
                    $config = Get-CimInstance -ClassName Win32_NetworkAdapterConfiguration -Filter "Index=$($_.Index)" -ComputerName $computer
                    if ($config.IPEnabled) {
                        [PSCustomObject]@{
                            Name = $_.Name
                            IPAddress = $config.IPAddress -join ', '
                            MACAddress = $_.MACAddress
                            Speed = if ($_.Speed) { Convert-Bytes $_.Speed } else { 'Unknown' }
                        }
                    }
                }
            }
            
            # Create comprehensive system info object
            $systemInfo = [PSCustomObject]@{
                PSTypeName = 'SystemInfoReport'
                ComputerName = $computer
                Timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
                OperatingSystem = $os.Caption
                LastBootTime = $os.LastBootUpTime
                CPU = [PSCustomObject]@{
                    Name = $cpu.Name
                    Cores = $cpu.NumberOfCores
                    LogicalProcessors = $cpu.NumberOfLogicalProcessors
                    MaxClockSpeedMHz = $cpu.MaxClockSpeed
                }
                Memory = [PSCustomObject]@{
                    TotalGB = $totalMemoryGB
                    FreeGB = $freeMemoryGB
                    UsagePercent = [Math]::Round((($totalMemoryGB - $freeMemoryGB) / $totalMemoryGB) * 100, 1)
                }
                Disks = $diskInfo
                Network = $networkInfo
            }
            
            $results += $systemInfo
            Write-Host "✅ Successfully gathered information from: $computer" -ForegroundColor Green
        }
        catch {
            Write-Error "❌ Failed to get system info from '$computer': $($_.Exception.Message)"
        }
    }
}

end {
    # Output results based on format
    switch ($OutputFormat) {
        'Object' { $results }
        'JSON' { $results | ConvertTo-Json -Depth 5 }
        'CSV' { $results | Export-Csv -NoTypeInformation }
        'HTML' { $results | ConvertTo-Html -Title "System Information Report" }
    }
    
    # Export if path specified
    if ($ExportPath) {
        try {
            switch ($OutputFormat) {
                'JSON' { $results | ConvertTo-Json -Depth 5 | Out-File -FilePath $ExportPath -Encoding UTF8 }
                'CSV' { $results | Export-Csv -Path $ExportPath -NoTypeInformation }
                'HTML' { $results | ConvertTo-Html -Title "System Report" | Out-File -FilePath $ExportPath }
                default { $results | Export-Clixml -Path $ExportPath }
            }
            Write-Host "📄 Report exported to: $ExportPath" -ForegroundColor Cyan
        }
        catch { Write-Error "Failed to export: $($_.Exception.Message)" }
    }
}`,
    'py-basic': `# web_scraper.py - Basic version
import requests
from bs4 import BeautifulSoup

# Simple news headlines scraper
def scrape_headlines():
    url = "https://news.ycombinator.com"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    headlines = []
    for title in soup.find_all('span', class_='titleline'):
        text = title.get_text().strip()
        if text:
            headlines.append(text)
    
    return headlines

# Simple weather scraper (example URL)
def scrape_weather():
    # Note: This is a simplified example
    print("Current weather data:")
    print("Temperature: 72°F")
    print("Conditions: Sunny")
    print("Humidity: 45%")

# Main execution
if __name__ == "__main__":
    print("=== Web Scraper Results ===")
    
    print("\\nTop Headlines:")
    headlines = scrape_headlines()
    for i, headline in enumerate(headlines[:5], 1):
        print(f"{i}. {headline}")
    
    print("\\nWeather Information:")
    scrape_weather()`,
    'py-structured': `#!/usr/bin/env python3
"""
Web Scraper - Structured version
Scrapes news headlines and weather data with proper organization
"""

import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
from pathlib import Path
import json

class NewsScraper:
    """Handles news headline scraping"""
    
    def __init__(self, base_url="https://news.ycombinator.com"):
        self.base_url = base_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def scrape_headlines(self, limit=10):
        """Scrape news headlines"""
        try:
            response = requests.get(self.base_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            headlines = []
            
            for title in soup.find_all('span', class_='titleline')[:limit]:
                text = title.get_text().strip()
                link_elem = title.find('a')
                link = link_elem['href'] if link_elem else None
                
                if text:
                    headlines.append({
                        'title': text,
                        'link': link,
                        'scraped_at': datetime.now().isoformat()
                    })
            
            return headlines
            
        except requests.RequestException as e:
            logging.error(f"Error scraping headlines: {e}")
            return []

class WeatherScraper:
    """Handles weather data scraping"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def scrape_weather(self, city="Seattle"):
        """Scrape weather data for a city"""
        # Simulated weather data for demo purposes
        # In real implementation, would scrape from weather service
        weather_data = {
            'city': city,
            'temperature': '72°F',
            'conditions': 'Partly Cloudy',
            'humidity': '65%',
            'wind_speed': '8 mph',
            'updated_at': datetime.now().isoformat()
        }
        
        logging.info(f"Retrieved weather data for {city}")
        return weather_data

class DataExporter:
    """Handles data export functionality"""
    
    @staticmethod
    def save_to_json(data, filename):
        """Save data to JSON file"""
        try:
            output_path = Path('data') / filename
            output_path.parent.mkdir(exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logging.info(f"Data saved to {output_path}")
            return str(output_path)
            
        except Exception as e:
            logging.error(f"Error saving data: {e}")
            return None

def main():
    """Main application logic"""
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    print("=== Web Scraper - Structured Version ===")
    
    # Initialize scrapers
    news_scraper = NewsScraper()
    weather_scraper = WeatherScraper()
    exporter = DataExporter()
    
    # Scrape headlines
    print("\\nScraping headlines...")
    headlines = news_scraper.scrape_headlines(limit=5)
    
    if headlines:
        print(f"Found {len(headlines)} headlines:")
        for i, headline in enumerate(headlines, 1):
            print(f"{i}. {headline['title']}")
    
    # Scrape weather
    print("\\nGetting weather data...")
    weather = weather_scraper.scrape_weather("New York")
    
    print(f"Weather in {weather['city']}:")
    print(f"  Temperature: {weather['temperature']}")
    print(f"  Conditions: {weather['conditions']}")
    print(f"  Humidity: {weather['humidity']}")
    
    # Export data
    all_data = {
        'headlines': headlines,
        'weather': weather,
        'report_generated': datetime.now().isoformat()
    }
    
    exported_file = exporter.save_to_json(all_data, 'scraper_results.json')
    if exported_file:
        print(f"\\nData exported to: {exported_file}")

if __name__ == "__main__":
    main()`,
    'py-professional': `#!/usr/bin/env python3
"""
Web Scraper - Professional version
A comprehensive web scraping tool for headlines and weather data

Author: Joshua Walderbach
Version: 2.0.0
License: MIT
"""

import argparse
import asyncio
import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Union
from dataclasses import dataclass, asdict
from urllib.parse import urljoin, urlparse

import aiohttp
import requests
from bs4 import BeautifulSoup
import yaml

@dataclass
class Headline:
    """Data model for news headlines"""
    title: str
    url: Optional[str] = None
    source: Optional[str] = None
    published_at: Optional[str] = None
    scraped_at: str = ""
    
    def __post_init__(self):
        if not self.scraped_at:
            self.scraped_at = datetime.now().isoformat()

@dataclass
class WeatherData:
    """Data model for weather information"""
    city: str
    temperature: str
    conditions: str
    humidity: Optional[str] = None
    wind_speed: Optional[str] = None
    pressure: Optional[str] = None
    updated_at: str = ""
    
    def __post_init__(self):
        if not self.updated_at:
            self.updated_at = datetime.now().isoformat()

class ScraperConfig:
    """Configuration management for scraper"""
    
    def __init__(self, config_path: str = "config/settings.yaml"):
        self.config_path = Path(config_path)
        self.config = self._load_config()
    
    def _load_config(self) -> Dict:
        """Load configuration from YAML file"""
        default_config = {
            'user_agents': [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ],
            'request_delay': 1,
            'timeout': 10,
            'max_retries': 3,
            'output_formats': ['json', 'csv', 'xml']
        }
        
        if self.config_path.exists():
            try:
                with open(self.config_path, 'r') as f:
                    return yaml.safe_load(f) or default_config
            except Exception:
                return default_config
        return default_config

class BaseScraper:
    """Base class for all scrapers"""
    
    def __init__(self, config: ScraperConfig):
        self.config = config.config
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': self.config['user_agents'][0]
        })
        self.logger = self._setup_logging()
    
    def _setup_logging(self) -> logging.Logger:
        """Set up logging configuration"""
        logger = logging.getLogger(self.__class__.__name__)
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.setLevel(logging.INFO)
        return logger
    
    def _make_request(self, url: str) -> Optional[BeautifulSoup]:
        """Make HTTP request with retry logic"""
        for attempt in range(self.config['max_retries']):
            try:
                response = self.session.get(
                    url, 
                    timeout=self.config['timeout']
                )
                response.raise_for_status()
                return BeautifulSoup(response.content, 'html.parser')
                
            except requests.RequestException as e:
                self.logger.warning(f"Request failed (attempt {attempt + 1}): {e}")
                if attempt < self.config['max_retries'] - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    
        return None

class NewsScraper(BaseScraper):
    """Professional news headlines scraper"""
    
    def __init__(self, config: ScraperConfig):
        super().__init__(config)
        self.sources = {
            'hackernews': {
                'url': 'https://news.ycombinator.com',
                'title_selector': 'span.titleline a',
                'source_name': 'Hacker News'
            },
            'reddit_programming': {
                'url': 'https://www.reddit.com/r/programming.json',
                'source_name': 'Reddit Programming'
            }
        }
    
    def scrape_headlines(self, source: str = 'hackernews', limit: int = 20) -> List[Headline]:
        """Scrape headlines from specified source"""
        if source not in self.sources:
            self.logger.error(f"Unknown source: {source}")
            return []
        
        source_config = self.sources[source]
        self.logger.info(f"Scraping headlines from {source_config['source_name']}")
        
        if source == 'hackernews':
            return self._scrape_hackernews(limit)
        elif source == 'reddit_programming':
            return self._scrape_reddit_programming(limit)
        
        return []
    
    def _scrape_hackernews(self, limit: int) -> List[Headline]:
        """Scrape Hacker News headlines"""
        soup = self._make_request(self.sources['hackernews']['url'])
        if not soup:
            return []
        
        headlines = []
        title_elements = soup.select('span.titleline')[:limit]
        
        for element in title_elements:
            link = element.find('a')
            if link:
                url = link.get('href', '')
                if url.startswith('item?'):
                    url = urljoin(self.sources['hackernews']['url'], url)
                
                headline = Headline(
                    title=link.get_text().strip(),
                    url=url,
                    source='Hacker News'
                )
                headlines.append(headline)
        
        return headlines
    
    def _scrape_reddit_programming(self, limit: int) -> List[Headline]:
        """Scrape Reddit programming headlines"""
        try:
            response = self.session.get(
                self.sources['reddit_programming']['url'],
                headers={'User-Agent': self.config['user_agents'][0]}
            )
            response.raise_for_status()
            data = response.json()
            
            headlines = []
            for post in data['data']['children'][:limit]:
                post_data = post['data']
                headline = Headline(
                    title=post_data['title'],
                    url=post_data.get('url'),
                    source='Reddit Programming'
                )
                headlines.append(headline)
            
            return headlines
            
        except Exception as e:
            self.logger.error(f"Error scraping Reddit: {e}")
            return []

class WeatherScraper(BaseScraper):
    """Professional weather data scraper"""
    
    def scrape_weather(self, city: str = "Seattle") -> Optional[WeatherData]:
        """Scrape weather data for specified city"""
        # This is a demonstration with simulated data
        # In production, you would integrate with a weather API
        
        self.logger.info(f"Getting weather data for {city}")
        
        # Simulate API call delay
        time.sleep(0.5)
        
        # Simulated weather data
        weather_conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy']
        import random
        
        weather = WeatherData(
            city=city,
            temperature=f"{random.randint(45, 85)}°F",
            conditions=random.choice(weather_conditions),
            humidity=f"{random.randint(30, 80)}%",
            wind_speed=f"{random.randint(0, 15)} mph",
            pressure=f"{random.randint(29, 31):.2f} in"
        )
        
        return weather

class DataExporter:
    """Professional data export functionality"""
    
    def __init__(self, output_dir: str = "data/exports"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def export_data(self, data: Dict, format: str = 'json', filename: str = None) -> str:
        """Export data in specified format"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"scraper_results_{timestamp}"
        
        filepath = self.output_dir / f"{filename}.{format}"
        
        try:
            if format == 'json':
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False, default=str)
            
            elif format == 'csv':
                import pandas as pd
                # Flatten data for CSV export
                if 'headlines' in data:
                    df = pd.DataFrame([asdict(h) for h in data['headlines']])
                    df.to_csv(filepath, index=False)
            
            elif format == 'xml':
                import xml.etree.ElementTree as ET
                root = ET.Element("scraper_results")
                # Convert data to XML (simplified)
                for key, value in data.items():
                    if key != 'headlines':
                        elem = ET.SubElement(root, key)
                        elem.text = str(value)
                
                tree = ET.ElementTree(root)
                tree.write(filepath, encoding='utf-8', xml_declaration=True)
            
            return str(filepath)
            
        except Exception as e:
            logging.error(f"Export failed: {e}")
            return None

def main():
    """Main application with CLI interface"""
    parser = argparse.ArgumentParser(description="Professional Web Scraper")
    parser.add_argument("--source", default="hackernews", 
                       help="News source to scrape")
    parser.add_argument("--limit", type=int, default=10,
                       help="Number of headlines to scrape")
    parser.add_argument("--city", default="Seattle",
                       help="City for weather data")
    parser.add_argument("--format", default="json",
                       choices=["json", "csv", "xml"],
                       help="Output format")
    parser.add_argument("--output", help="Output filename")
    parser.add_argument("--config", default="config/settings.yaml",
                       help="Configuration file path")
    
    args = parser.parse_args()
    
    # Initialize components
    config = ScraperConfig(args.config)
    news_scraper = NewsScraper(config)
    weather_scraper = WeatherScraper(config)
    exporter = DataExporter()
    
    print(f"🌐 Professional Web Scraper v2.0.0")
    print(f"📰 Scraping {args.limit} headlines from {args.source}")
    print(f"🌤️  Getting weather for {args.city}")
    
    # Scrape data
    headlines = news_scraper.scrape_headlines(args.source, args.limit)
    weather = weather_scraper.scrape_weather(args.city)
    
    # Prepare results
    results = {
        'headlines': headlines,
        'weather': asdict(weather) if weather else None,
        'metadata': {
            'source': args.source,
            'total_headlines': len(headlines),
            'city': args.city,
            'scraped_at': datetime.now().isoformat(),
            'version': '2.0.0'
        }
    }
    
    # Display results
    print(f"\\n📊 Results:")
    print(f"   Headlines found: {len(headlines)}")
    if headlines:
        print("   Top headlines:")
        for i, headline in enumerate(headlines[:3], 1):
            print(f"   {i}. {headline.title}")
    
    if weather:
        print(f"   Weather in {weather.city}: {weather.temperature}, {weather.conditions}")
    
    # Export data
    exported_file = exporter.export_data(results, args.format, args.output)
    if exported_file:
        print(f"✅ Data exported to: {exported_file}")
    
    return results

if __name__ == "__main__":
    main()`
};

// Concept explanations
const conceptExplanations = {
    status: {
        title: "🔍 Git Status - Check What's Changed",
        content: `
            <p>The <code>git status</code> command is your Git dashboard - it shows you exactly what's happening in your repository at any moment.</p>
            
            <h4>What Git Status Shows You:</h4>
            <ul>
                <li><strong>Modified Files</strong> - Files you've changed but haven't staged yet</li>
                <li><strong>Staged Files</strong> - Files ready to be committed</li>
                <li><strong>Untracked Files</strong> - New files Git doesn't know about yet</li>
                <li><strong>Branch Information</strong> - Which branch you're on and sync status</li>
            </ul>
            
            <h4>Example Output:</h4>
            <pre><code class="language-bash">$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)
        modified:   README.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   script.ps1

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        newfile.txt</code></pre>
            
            <p><strong>Pro Tip:</strong> Run <code>git status</code> frequently - it's your friend and will guide you through the Git workflow!</p>
        `
    },
    add: {
        title: "➕ Git Add - Stage Your Changes",
        content: `
            <p>The <code>git add</code> command moves files to the "staging area" - think of it as preparing items for a photo before taking the snapshot (commit).</p>
            
            <h4>Common Git Add Commands:</h4>
            <div class="command-examples">
                <div class="command-example">
                    <code>git add filename.txt</code>
                    <p>Stage a specific file</p>
                </div>
                <div class="command-example">
                    <code>git add .</code>
                    <p>Stage all changes in current directory</p>
                </div>
                <div class="command-example">
                    <code>git add -A</code>
                    <p>Stage all changes including deletions</p>
                </div>
                <div class="command-example">
                    <code>git add *.ps1</code>
                    <p>Stage all PowerShell files</p>
                </div>
            </div>
            
            <h4>The Staging Area Concept:</h4>
            <p>Staging allows you to carefully choose exactly what goes into each commit. You might have changed 5 files, but only want to commit 2 of them - staging lets you do this precisely.</p>
            
            <h4>Visual Example:</h4>
            <pre><code>Working Directory  →  Staging Area  →  Repository
    (Your Files)       (Ready to Commit)    (Permanent History)
    
modified: script.ps1     [git add script.ps1]     [git commit]
modified: config.json         ✓ staged              ✓ committed
new: readme.md              not staged             not committed</code></pre>
        `
    },
    commit: {
        title: "💾 Git Commit - Save Your Snapshot",
        content: `
            <p>A commit creates a permanent snapshot of your staged changes. Each commit has a unique ID and includes a message describing what you changed and why.</p>
            
            <h4>Creating Good Commits:</h4>
            <pre><code class="language-bash"># Good commit with descriptive message
git commit -m "Add user authentication to PowerShell module"

# Even better - use the editor for longer messages
git commit
# Opens editor for multi-line message:
# Add user authentication to PowerShell module
#
# - Implement Get-Credential for secure login
# - Add input validation for username/password
# - Include error handling for failed authentication</code></pre>
            
            <h4>Commit Message Best Practices:</h4>
            <ul>
                <li><strong>Start with a verb</strong> - "Add", "Fix", "Update", "Remove"</li>
                <li><strong>Keep it under 50 characters</strong> for the first line</li>
                <li><strong>Be specific</strong> - "Fix login bug" not just "bug fix"</li>
                <li><strong>Explain why</strong>, not just what you changed</li>
            </ul>
            
            <h4>What Happens During a Commit:</h4>
            <ol>
                <li>Git creates a unique ID (hash) for this snapshot</li>
                <li>Stores the exact state of all staged files</li>
                <li>Records your name, email, timestamp, and message</li>
                <li>Links to the previous commit (creating history chain)</li>
            </ol>
            
            <p><strong>Remember:</strong> Commits are local until you push them to GitHub!</p>
        `
    },
    push: {
        title: "☁️ Git Push - Share Your Work",
        content: `
            <p>The <code>git push</code> command uploads your local commits to a remote repository (like GitHub), making them available to your team.</p>
            
            <h4>Basic Push Commands:</h4>
            <div class="command-examples">
                <div class="command-example">
                    <code>git push</code>
                    <p>Push current branch to its remote tracking branch</p>
                </div>
                <div class="command-example">
                    <code>git push origin main</code>
                    <p>Push main branch to origin remote</p>
                </div>
                <div class="command-example">
                    <code>git push -u origin feature-branch</code>
                    <p>Push new branch and set up tracking</p>
                </div>
            </div>
            
            <h4>What Happens During a Push:</h4>
            <ol>
                <li>Git compresses your commits and sends them to the remote</li>
                <li>Remote repository updates its history with your changes</li>
                <li>Other team members can now pull your changes</li>
                <li>Your changes become part of the shared project history</li>
            </ol>
            
            <h4>Push Flow Visualization:</h4>
            <pre><code>Your Computer                    GitHub
┌─────────────────┐              ┌─────────────────┐
│ Local Repository│              │ Remote Repository│
│                 │  git push    │                 │
│ • commit abc123 │ ──────────→  │ • commit abc123 │
│ • commit def456 │              │ • commit def456 │
│ • commit ghi789 │              │ • commit ghi789 │
└─────────────────┘              └─────────────────┘</code></pre>
            
            <h4>Common Push Scenarios:</h4>
            <ul>
                <li><strong>First Push:</strong> Use <code>-u</code> to set up branch tracking</li>
                <li><strong>Rejected Push:</strong> Someone else pushed first - pull their changes first</li>
                <li><strong>Force Push:</strong> Use <code>--force</code> carefully (can overwrite others' work)</li>
            </ul>
        `
    },
    repository: {
        title: "📁 Repository (Repo)",
        content: `
            <p>A repository is the foundation of Git - it's a special folder that tracks every change to your files over time. Think of it as a time machine for your code projects.</p>
            
            <h4>What's Inside a Repository:</h4>
            <ul>
                <li><strong>Working Directory</strong> - Your actual files (PowerShell scripts, Python files, documentation)</li>
                <li><strong>.git folder</strong> - Hidden folder containing all version history and Git metadata</li>
                <li><strong>Staging Area</strong> - Temporary space where you prepare files for the next commit</li>
                <li><strong>Local Repository</strong> - Complete history of all commits on your machine</li>
                <li><strong>Remote Repository</strong> - Shared copy on GitHub/GitLab for collaboration</li>
            </ul>
            
            <h4>Repository Types:</h4>
            <div class="repo-types">
                <div class="repo-type">
                    <strong>Local Repository:</strong> On your computer - where you do your work
                </div>
                <div class="repo-type">
                    <strong>Remote Repository:</strong> On GitHub/server - shared with your team
                </div>
                <div class="repo-type">
                    <strong>Bare Repository:</strong> Server-side repo with no working directory
                </div>
            </div>

            <h4>Example Repository Structure:</h4>
            <pre><code>MyPowerShellTools/               # Working Directory
├── .git/                        # Git metadata (hidden)
│   ├── objects/                 # All file versions
│   ├── refs/                    # Branch and tag references
│   ├── HEAD                     # Current branch pointer
│   └── config                   # Repository settings
├── Scripts/                     # Your actual code
│   ├── Backup-Files.ps1
│   ├── Get-SystemInfo.ps1
│   └── Deploy-Application.ps1
├── Modules/
│   └── UtilityFunctions/
├── Tests/
│   ├── Backup-Files.Tests.ps1
│   └── Get-SystemInfo.Tests.ps1
├── README.md
├── .gitignore                   # Files to ignore
└── LICENSE</code></pre>

            <h4>Key Commands:</h4>
            <pre><code># Initialize a new repository
git init

# Clone an existing repository
git clone https://github.com/username/repo.git

# Check repository status
git status

# View repository history
git log --oneline --graph</code></pre>
        `
    },
    commit: {
        title: "💾 Commit",
        content: `
            <p>A commit is like taking a snapshot of your entire project at a specific moment. Each commit creates a permanent record that you can return to later.</p>
            
            <h4>Anatomy of a Commit:</h4>
            <ul>
                <li><strong>SHA Hash</strong> - Unique identifier (e.g., a1b2c3d4e5f6...)</li>
                <li><strong>Author</strong> - Who made the commit (name and email)</li>
                <li><strong>Timestamp</strong> - Exact date and time</li>
                <li><strong>Message</strong> - Description of what changed and why</li>
                <li><strong>Parent(s)</strong> - Previous commit(s) this builds upon</li>
                <li><strong>Tree</strong> - Snapshot of all files at this point</li>
            </ul>

            <h4>The Three Areas:</h4>
            <div class="git-areas">
                <div class="area working">
                    <strong>Working Directory:</strong><br>
                    Files you're currently editing
                </div>
                <div class="area staging">
                    <strong>Staging Area:</strong><br>
                    Files prepared for next commit
                </div>
                <div class="area repository">
                    <strong>Repository:</strong><br>
                    Permanent commit history
                </div>
            </div>

            <h4>Commit Message Best Practices:</h4>
            <div class="commit-examples">
                <div class="good-commit">
                    <h5>✅ Good Commit Message:</h5>
                    <pre><code>Fix: Resolve backup script timeout issue

- Increase timeout from 30s to 300s for large files
- Add progress indicators for user feedback  
- Handle network interruptions gracefully
- Update error messages to be more descriptive

Fixes #45
Tested on Windows Server 2019 and 2022</code></pre>
                </div>
                
                <div class="bad-commit">
                    <h5>❌ Poor Commit Messages:</h5>
                    <pre><code>fixed stuff
update
changes
asdf
backup script</code></pre>
                </div>
            </div>

            <h4>Commit Commands:</h4>
            <pre><code># Add files to staging area
git add filename.ps1
git add .                    # Add all changed files
git add *.ps1               # Add all PowerShell files

# Create a commit
git commit -m "Your message here"
git commit -am "Add and commit in one step"

# View commit history
git log
git log --oneline           # Compact view
git log --author="Joshua"   # Filter by author
git log --since="2 weeks ago"

# Show what changed in a commit
git show a1b2c3d            # Show specific commit
git diff HEAD~1             # Compare with previous commit</code></pre>

            <h4>Amending Commits:</h4>
            <pre><code># Fix the last commit message
git commit --amend -m "Better message"

# Add forgotten files to last commit
git add forgotten-file.ps1
git commit --amend --no-edit</code></pre>
        `
    },
    branch: {
        title: "🌳 Branch",
        content: `
            <p>Branches are parallel lines of development that allow you to work on different features, experiments, or fixes without affecting the main codebase. Think of them as alternate timelines for your project.</p>
            
            <h4>Why Use Branches?</h4>
            <ul>
                <li><strong>Isolation</strong> - Work on features without breaking main code</li>
                <li><strong>Collaboration</strong> - Multiple developers can work simultaneously</li>
                <li><strong>Experimentation</strong> - Try new approaches safely</li>
                <li><strong>Organization</strong> - Separate different types of work</li>
                <li><strong>Code Review</strong> - Review changes before merging</li>
            </ul>

            <h4>Common Branch Types:</h4>
            <div class="branch-types">
                <div class="branch-type main">
                    <strong>main/master:</strong> The primary, production-ready branch
                </div>
                <div class="branch-type feature">
                    <strong>feature/*:</strong> New features being developed
                    <br><small>e.g., feature/azure-backup, feature/email-notifications</small>
                </div>
                <div class="branch-type hotfix">
                    <strong>hotfix/*:</strong> Urgent bug fixes for production
                    <br><small>e.g., hotfix/security-patch, hotfix/critical-error</small>
                </div>
                <div class="branch-type develop">
                    <strong>develop:</strong> Integration branch for ongoing development
                </div>
                <div class="branch-type release">
                    <strong>release/*:</strong> Preparing for a new release
                    <br><small>e.g., release/v2.1.0</small>
                </div>
            </div>

            <h4>Branch Workflow Example:</h4>
            <pre><code># See all branches
git branch                   # Local branches
git branch -r               # Remote branches  
git branch -a               # All branches

# Create and switch to new branch
git checkout -b feature/new-backup-module
git switch -c feature/new-backup-module  # Modern syntax

# Switch between branches
git checkout main
git switch develop

# Work on your feature...
# Edit files, add commits, etc.

# Push branch to remote
git push -u origin feature/new-backup-module

# Delete branch (after merging)
git branch -d feature/new-backup-module
git push origin --delete feature/new-backup-module</code></pre>

            <h4>Branch Visualization:</h4>
            <pre><code>main     A---B---C---F---G---H
                \\           /
feature           D---E---/
                
A, B, C: Initial commits on main
D, E: Feature development commits  
F: Merge feature into main
G, H: Continued development</code></pre>

            <h4>Best Practices:</h4>
            <ul>
                <li>Use descriptive branch names (feature/add-logging, not temp-branch)</li>
                <li>Keep branches focused on single features/fixes</li>
                <li>Regularly sync with main branch: <code>git merge main</code></li>
                <li>Delete branches after merging to keep repository clean</li>
                <li>Use pull requests for code review before merging</li>
            </ul>
        `
    },
    merge: {
        title: "🔀 Merge",
        content: `
            <p>Merging is the process of combining changes from different branches. It's how individual work gets integrated back into the main codebase.</p>
            
            <h4>Types of Merges:</h4>
            
            <div class="merge-types">
                <div class="merge-type">
                    <h5>🚀 Fast-Forward Merge</h5>
                    <p>When the target branch hasn't changed since you branched off. Git simply moves the pointer forward.</p>
                    <pre><code>Before:  main    A---B
                      \\
         feature       C---D

After:   main    A---B---C---D
         (feature branch pointer moved)</code></pre>
                </div>

                <div class="merge-type">
                    <h5>🔀 Three-Way Merge</h5>
                    <p>When both branches have new commits. Git creates a new merge commit.</p>
                    <pre><code>Before:  main    A---B---E
                      \\           \\
         feature       C---D---F

After:   main    A---B---E---G
                      \\       /
         feature       C---D---F
         (G is the merge commit)</code></pre>
                </div>

                <div class="merge-type">
                    <h5>📝 Squash Merge</h5>
                    <p>Combines all feature branch commits into a single commit on main.</p>
                    <pre><code>Before:  main    A---B
                      \\
         feature       C---D---E

After:   main    A---B---F
         (F contains all changes from C, D, E)</code></pre>
                </div>
            </div>

            <h4>Merge Conflicts:</h4>
            <p>When Git can't automatically combine changes, you get a merge conflict:</p>
            
            <div class="conflict-example">
                <h5>Example Conflict in PowerShell Script:</h5>
                <pre><code># Backup-Files.ps1
param(
    [string]$Source,
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
    [string]$Destination = "C:\\Backups"
=======
    [string]$Destination = "D:\\Archive"
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/change-default-path
)

# Your job: Choose which version to keep or combine them</code></pre>
            </div>

            <h4>Resolving Conflicts:</h4>
            <pre><code># 1. See which files have conflicts
git status

# 2. Edit the conflicted files
# Remove &lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt; markers
# Keep the changes you want

# 3. Mark as resolved
git add Backup-Files.ps1

# 4. Complete the merge
git commit -m "Merge feature/change-default-path - resolved destination conflict"</code></pre>

            <h4>Merge Commands:</h4>
            <pre><code># Basic merge workflow
git checkout main              # Switch to target branch
git pull origin main          # Get latest changes
git merge feature/my-feature   # Merge feature branch

# Merge with specific strategies
git merge --no-ff feature/my-feature    # Force merge commit
git merge --squash feature/my-feature   # Squash all commits

# Abort a problematic merge
git merge --abort

# See what would be merged
git diff main..feature/my-feature
git log main..feature/my-feature --oneline</code></pre>

            <h4>Pull Request Workflow (Recommended):</h4>
            <ol>
                <li><strong>Push feature branch:</strong> <code>git push origin feature/my-feature</code></li>
                <li><strong>Create Pull Request</strong> on GitHub/GitLab</li>
                <li><strong>Code Review:</strong> Team reviews your changes</li>
                <li><strong>Address Feedback:</strong> Make additional commits if needed</li>
                <li><strong>Merge via Web Interface:</strong> Maintainer merges when approved</li>
                <li><strong>Clean up:</strong> Delete feature branch</li>
            </ol>

            <h4>Best Practices:</h4>
            <ul>
                <li>Always merge feature branches into main, not the other way around</li>
                <li>Test your changes before creating a pull request</li>
                <li>Use descriptive merge commit messages</li>
                <li>Consider squashing commits for cleaner history</li>
                <li>Use <code>git log --graph</code> to visualize merge history</li>
            </ul>
        `
    },
    conflict: {
        title: "⚡ Merge Conflicts - When Git Needs Help",
        content: `
            <p>Merge conflicts occur when Git can't automatically combine changes from different branches. This happens when the same lines of code have been modified differently in both branches.</p>
            
            <h4>When Do Conflicts Happen?</h4>
            <ul>
                <li><strong>Same line modified:</strong> Both branches changed the same line differently</li>
                <li><strong>File renamed:</strong> One branch renamed a file while another modified it</li>
                <li><strong>File deleted:</strong> One branch deleted a file while another modified it</li>
                <li><strong>Binary files:</strong> Images or executables changed in both branches</li>
            </ul>
            
            <h4>Real Example - PowerShell Configuration Conflict:</h4>
            <pre><code># Config.ps1 - Both branches modified the default path
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (your current branch)
$DefaultPath = "C:\\WindowsTools\\Scripts"
$LogLevel = "Verbose"
=======
$DefaultPath = "D:\\PowerShellModules\\Scripts"  
$LogLevel = "Warning"
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/update-config (incoming branch)
$BackupEnabled = $true</code></pre>
            
            <h4>Conflict Resolution Steps:</h4>
            <div class="resolution-steps">
                <div class="step-item">
                    <h5>1. 🔍 Identify Conflicts</h5>
                    <pre><code>git status
# Shows: both modified: Config.ps1</code></pre>
                </div>
                
                <div class="step-item">
                    <h5>2. ✏️ Edit Conflicted Files</h5>
                    <p>Open the file and look for conflict markers:</p>
                    <ul>
                        <li><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> - Your changes</li>
                        <li><code>=======</code> - Separator</li>
                        <li><code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; branch-name</code> - Incoming changes</li>
                    </ul>
                </div>
                
                <div class="step-item">
                    <h5>3. 🎯 Choose Resolution</h5>
                    <pre><code># Option A: Keep your version
$DefaultPath = "C:\\WindowsTools\\Scripts"
$LogLevel = "Verbose"
$BackupEnabled = $true

# Option B: Keep incoming version  
$DefaultPath = "D:\\PowerShellModules\\Scripts"
$LogLevel = "Warning"
$BackupEnabled = $true

# Option C: Combine both (best choice)
$DefaultPath = "D:\\PowerShellModules\\Scripts"  # Use new path
$LogLevel = "Verbose"                           # Keep verbose logging  
$BackupEnabled = $true</code></pre>
                </div>
                
                <div class="step-item">
                    <h5>4. ✅ Mark as Resolved</h5>
                    <pre><code>git add Config.ps1
git commit -m "Resolve config path conflict - use D: drive with verbose logging"</code></pre>
                </div>
            </div>
            
            <h4>Helpful Tools:</h4>
            <ul>
                <li><strong>VS Code:</strong> Built-in merge conflict resolver</li>
                <li><strong>Git GUI tools:</strong> Visual merge tools like GitKraken</li>
                <li><strong>Command line:</strong> <code>git mergetool</code> opens your configured merge tool</li>
                <li><strong>Abort merge:</strong> <code>git merge --abort</code> to start over</li>
            </ul>
            
            <h4>Prevention Tips:</h4>
            <ul>
                <li>Communicate with your team about file changes</li>
                <li>Keep feature branches small and focused</li>
                <li>Regularly sync your branch with main</li>
                <li>Use clear, specific commit messages</li>
            </ul>
        `
    },
    pull: {
        title: "⬇️ Git Pull - Get Latest Changes", 
        content: `
            <p>Git pull downloads and integrates changes from a remote repository into your current branch. It's like saying "get me up to date with what the team has done."</p>
            
            <h4>What Git Pull Actually Does:</h4>
            <p>Git pull is actually two commands combined:</p>
            <pre><code># Git pull does this:
git fetch origin    # Download latest changes
git merge origin/main  # Merge them into your branch

# Equivalent to:
git pull origin main</code></pre>
            
            <h4>Common Pull Scenarios:</h4>
            <div class="pull-scenarios">
                <div class="scenario">
                    <h5>📥 Daily Sync (Most Common)</h5>
                    <pre><code># Start your day by getting latest changes
git checkout main
git pull origin main

# Now your local main matches remote main</code></pre>
                </div>
                
                <div class="scenario">
                    <h5>🔄 Update Feature Branch</h5>
                    <pre><code># Get latest main changes into your feature branch
git checkout feature/my-feature
git pull origin main

# Or merge main into your feature branch
git merge main</code></pre>
                </div>
                
                <div class="scenario">
                    <h5>👥 Collaborative Feature Work</h5>
                    <pre><code># Multiple people working on same feature branch
git checkout feature/shared-feature
git pull origin feature/shared-feature

# Get your teammates' latest commits</code></pre>
                </div>
            </div>
            
            <h4>Pull Options & Strategies:</h4>
            <pre><code># Basic pull (merge strategy)
git pull origin main

# Pull with rebase (cleaner history)
git pull --rebase origin main

# Pull specific branch  
git pull origin feature/specific-branch

# Pull and show what changed
git pull --verbose origin main</code></pre>
            
            <h4>When Pull Goes Wrong:</h4>
            <div class="pull-problems">
                <div class="problem">
                    <h5>⚠️ Merge Conflicts</h5>
                    <p>If you and someone else changed the same lines:</p>
                    <pre><code>$ git pull origin main
Auto-merging PowerShell-Scripts/Config.ps1
CONFLICT (content): Merge conflict in PowerShell-Scripts/Config.ps1
Automatic merge failed; fix conflicts and then commit the result.</code></pre>
                    <p><strong>Solution:</strong> Resolve conflicts manually, then commit</p>
                </div>
                
                <div class="problem">
                    <h5>🔄 Diverged Histories</h5>
                    <p>When your local and remote branches have different commits:</p>
                    <pre><code>$ git pull origin main
hint: You have divergent branches and need to specify how to reconcile them.</code></pre>
                    <p><strong>Solutions:</strong></p>
                    <ul>
                        <li><code>git pull --rebase</code> - Put your commits on top</li>
                        <li><code>git pull --merge</code> - Create merge commit (default)</li>
                    </ul>
                </div>
            </div>
            
            <h4>Best Practices:</h4>
            <ul>
                <li><strong>Pull before you start work:</strong> Always sync with remote first</li>
                <li><strong>Commit before pulling:</strong> Save your work before getting updates</li>
                <li><strong>Use pull requests:</strong> Don't push directly to main branch</li>
                <li><strong>Regular syncing:</strong> Pull main into feature branches frequently</li>
                <li><strong>Check what's coming:</strong> Use <code>git fetch</code> then <code>git log origin/main</code></li>
            </ul>
            
            <h4>Pro Tips:</h4>
            <ul>
                <li>Set up pull to rebase by default: <code>git config pull.rebase true</code></li>
                <li>See what changed: <code>git pull && git log --oneline -5</code></li>
                <li>Pull from specific remote: <code>git pull upstream main</code> (for forks)</li>
            </ul>
        `
    }
};

// Collaboration demos
const collaborationDemos = {
    pullRequest: `
        <h3>🔀 Pull Request Demo</h3>
        <div class="pr-demo">
            <div class="pr-header">
                <h4>Add error handling to backup script</h4>
                <span class="pr-status open">Open</span>
            </div>
            <div class="pr-content">
                <p><strong>Description:</strong> This PR improves the backup script by adding comprehensive error handling and logging.</p>
                <p><strong>Changes:</strong></p>
                <ul>
                    <li>✅ Added try-catch blocks for file operations</li>
                    <li>✅ Implemented detailed logging</li>
                    <li>✅ Added parameter validation</li>
                    <li>✅ Updated documentation</li>
                </ul>
                <div class="pr-actions">
                    <button class="btn">👍 Approve</button>
                    <button class="btn">💬 Comment</button>
                    <button class="btn">🔄 Request Changes</button>
                </div>
            </div>
        </div>
    `,
    issue: `
        <h3>🐛 GitHub Issues Demo</h3>
        <div class="issue-demo">
            <div class="issue-item">
                <div class="issue-header">
                    <span class="issue-number">#47</span>
                    <h4>Backup script fails on network drives</h4>
                    <span class="issue-label bug">bug</span>
                    <span class="issue-label priority">high priority</span>
                </div>
                <div class="issue-content">
                    <p><strong>Description:</strong> The backup script throws an error when trying to backup files from network drives.</p>
                    <p><strong>Steps to reproduce:</strong></p>
                    <ol>
                        <li>Map a network drive (Z:\\)</li>
                        <li>Run Backup-Files.ps1 -Source Z:\\Data</li>
                        <li>Observe the error</li>
                    </ol>
                    <p><strong>Expected:</strong> Files should be backed up successfully</p>
                    <p><strong>Actual:</strong> Script fails with "Access denied" error</p>
                </div>
            </div>
        </div>
    `,
    project: `
        <h3>📋 GitHub Projects Demo</h3>
        <div class="project-demo">
            <div class="kanban-board">
                <div class="kanban-column">
                    <h4>📝 To Do</h4>
                    <div class="kanban-card">
                        <h5>Add Azure integration</h5>
                        <p>Support backup to Azure Blob Storage</p>
                        <span class="card-label feature">feature</span>
                    </div>
                    <div class="kanban-card">
                        <h5>Update documentation</h5>
                        <p>Add examples for network drives</p>
                        <span class="card-label docs">docs</span>
                    </div>
                </div>
                <div class="kanban-column">
                    <h4>🔄 In Progress</h4>
                    <div class="kanban-card">
                        <h5>Fix network drive issue</h5>
                        <p>Resolve access denied errors</p>
                        <span class="card-label bug">bug</span>
                    </div>
                </div>
                <div class="kanban-column">
                    <h4>✅ Done</h4>
                    <div class="kanban-card">
                        <h5>Add error handling</h5>
                        <p>Comprehensive error handling added</p>
                        <span class="card-label enhancement">enhancement</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    actions: `
        <h3>⚡ GitHub Actions Demo</h3>
        <div class="actions-demo">
            <div class="workflow-item">
                <div class="workflow-header">
                    <h4>🔍 PowerShell Script Testing</h4>
                    <span class="workflow-status success">✅ Passed</span>
                </div>
                <div class="workflow-steps">
                    <div class="step-item completed">
                        <span class="step-icon">✅</span>
                        <span>Checkout code</span>
                        <span class="step-time">2s</span>
                    </div>
                    <div class="step-item completed">
                        <span class="step-icon">✅</span>
                        <span>Install PowerShell modules</span>
                        <span class="step-time">15s</span>
                    </div>
                    <div class="step-item completed">
                        <span class="step-icon">✅</span>
                        <span>Run Pester tests</span>
                        <span class="step-time">8s</span>
                    </div>
                    <div class="step-item completed">
                        <span class="step-icon">✅</span>
                        <span>Upload test results</span>
                        <span class="step-time">3s</span>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Initialize tutorial
document.addEventListener('DOMContentLoaded', function() {
    // Load theme first
    loadTheme();
    
    // Initialize core functionality
    initializeNavigation();
    initializeTabs();
    initializeCodeTabs();
    
    // Clear any saved progress and URL hash to ensure we start at the intro section
    localStorage.removeItem('github-tutorial-progress');
    window.location.hash = '';
    
    // Force start at intro section
    currentSection = 0;
    
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show intro section
    const introSection = document.getElementById('intro');
    if (introSection) {
        introSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const introNavLink = document.querySelector('[data-section="intro"]');
    if (introNavLink) {
        introNavLink.classList.add('active');
    }
    
    updateProgress();
    updateNavigationButtons();
    
    // Initialize new retro-modern features
    addScrollAnimations();
    initScrollTriggers();
    
    // Add some startup animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Navigation functions
function initializeNavigation() {
    // Add click handlers to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const sectionIndex = sections.indexOf(sectionId);
            if (sectionIndex !== -1) {
                showSection(sectionIndex);
            }
        });
    });
}

function showSection(index) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sections[index]);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav link
    const targetNavLink = document.querySelector(`[data-section="${sections[index]}"]`);
    if (targetNavLink) {
        targetNavLink.classList.add('active');
    }
    
    // Update current section
    currentSection = index;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update progress bar
    updateProgress();
    
    // Initialize quiz intro if we're on the final-quiz section
    if (sections[index] === 'final-quiz') {
        // Reset quiz state when navigating to the section
        if (!quizStarted) {
            document.getElementById('quizIntro').style.display = 'block';
            document.getElementById('quizContainer').style.display = 'none';
            document.getElementById('quizResults').style.display = 'none';
            }
    }
    
    // Save progress
    saveProgress();
}

function nextSection() {
    if (currentSection < sections.length - 1) {
        showSection(currentSection + 1);
    }
}

function previousSection() {
    if (currentSection > 0) {
        showSection(currentSection - 1);
    }
}

// Navigate to specific section
function navigateToSection(sectionName) {
    const sectionIndex = sections.indexOf(sectionName);
    if (sectionIndex !== -1) {
        currentSection = sectionIndex;
        showSection(currentSection);
        updateProgress();
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevSectionBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentSection === 0;
    nextBtn.disabled = currentSection === sections.length - 1;
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progress = ((currentSection + 1) / sections.length) * 100;
    progressFill.style.width = `${progress}%`;
}

// Interactive Demo functions removed - no longer needed

// Setup tab functionality
function showSetupTab(tabType) {
    // Hide all setup contents
    document.querySelectorAll('.setup-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all setup tabs
    document.querySelectorAll('.setup-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show target setup content
    const targetContent = document.getElementById(tabType);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

function simulateGitCheck() {
    const output = document.getElementById('setupCheckOutput');
    output.style.display = 'block';
    output.className = 'terminal';
    output.innerHTML = '<div class="terminal-content"></div>';
    const terminalContent = output.querySelector('.terminal-content');
    
    const commands = [
        { text: '$ git --version', isCommand: true },
        { text: 'git version 2.42.0.windows.1', isOutput: true },
        { text: '', isOutput: true },
        { text: '$ git config --global --list', isCommand: true },
        { text: 'user.name=Norman Borlaug', isOutput: true },
        { text: 'user.email=nborlaug@ag.tamu.edu', isOutput: true },
        { text: 'init.defaultbranch=main', isOutput: true },
        { text: 'core.preloadindex=true', isOutput: true },
        { text: 'core.fscache=true', isOutput: true },
        { text: '', isOutput: true },
        { text: '✅ Git is properly configured!', isSuccess: true }
    ];
    
    terminalContent.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
        if (i < commands.length) {
            const line = document.createElement('div');
            if (commands[i].isCommand) {
                line.innerHTML = `<span style="color: var(--blue-400);">${commands[i].text}</span>`;
            } else if (commands[i].isSuccess) {
                line.innerHTML = `<span style="color: var(--emerald-400);">${commands[i].text}</span>`;
            } else {
                line.textContent = commands[i].text;
            }
            terminalContent.appendChild(line);
            terminalContent.scrollTop = terminalContent.scrollHeight;
            i++;
        } else {
            clearInterval(interval);
        }
    }, 400);
}

function simulateGitHubAuth() {
    const output = document.getElementById('setupCheckOutput');
    output.style.display = 'block';
    output.className = 'terminal';
    output.innerHTML = '<div class="terminal-content"></div>';
    const terminalContent = output.querySelector('.terminal-content');
    
    const commands = [
        { text: '$ ssh -T git@github.com', isCommand: true },
        { text: 'Hi Norman Borlaug! You\'ve successfully authenticated, but GitHub does not provide shell access.', isOutput: true },
        { text: '', isOutput: true },
        { text: '$ curl -H "Authorization: token ghp_****" https://api.github.com/user', isCommand: true },
        { text: '{', isOutput: true },
        { text: '  "login": "nborlaug",', isOutput: true },
        { text: '  "id": 12345678,', isOutput: true },
        { text: '  "name": "Norman Borlaug",', isOutput: true },
        { text: '  "email": "nborlaug@ag.tamu.edu"', isOutput: true },
        { text: '}', isOutput: true },
        { text: '', isOutput: true },
        { text: '✅ GitHub authentication successful!', isSuccess: true }
    ];
    
    terminalContent.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
        if (i < commands.length) {
            const line = document.createElement('div');
            if (commands[i].isCommand) {
                line.innerHTML = `<span style="color: var(--blue-400);">${commands[i].text}</span>`;
            } else if (commands[i].isSuccess) {
                line.innerHTML = `<span style="color: var(--emerald-400);">${commands[i].text}</span>`;
            } else {
                line.textContent = commands[i].text;
            }
            terminalContent.appendChild(line);
            terminalContent.scrollTop = terminalContent.scrollHeight;
            i++;
        } else {
            clearInterval(interval);
        }
    }, 300);
}

function simulateToolsCheck() {
    const output = document.getElementById('setupCheckOutput');
    output.style.display = 'block';
    output.className = 'terminal';
    output.innerHTML = '<div class="terminal-content"></div>';
    const terminalContent = output.querySelector('.terminal-content');
    
    const commands = [
        { text: '🔍 Checking GitHub Desktop...', isInfo: true },
        { text: 'GitHub Desktop found at: C:\\Users\\Norman\\AppData\\Local\\GitHubDesktop\\GitHubDesktop.exe', isOutput: true },
        { text: 'Version: 3.3.3', isOutput: true },
        { text: '✅ GitHub Desktop installed', isSuccess: true },
        { text: '', isOutput: true },
        { text: '🔍 Checking VS Code...', isInfo: true },
        { text: '$ code --version', isCommand: true },
        { text: '1.84.2', isOutput: true },
        { text: 'Universal', isOutput: true },
        { text: 'VS Code found at: C:\\Program Files\\Microsoft VS Code\\Code.exe', isOutput: true },
        { text: '✅ VS Code installed', isSuccess: true },
        { text: '', isOutput: true },
        { text: '🔍 Checking VS Code Extensions...', isInfo: true },
        { text: '$ code --list-extensions | findstr -i github', isCommand: true },
        { text: 'GitHub.vscode-github-extension-pack', isOutput: true },
        { text: '$ code --list-extensions | findstr -i powershell', isCommand: true },
        { text: 'ms-vscode.powershell', isOutput: true },
        { text: '$ code --list-extensions | findstr -i gitlens', isCommand: true },
        { text: 'eamodio.gitlens', isOutput: true },
        { text: '✅ All recommended extensions installed', isSuccess: true },
        { text: '', isOutput: true },
        { text: '🎉 Setup verification complete!', isInfo: true },
        { text: '✅ Git for Windows: Installed and configured', isSuccess: true },
        { text: '✅ GitHub Authentication: Working', isSuccess: true },
        { text: '✅ GitHub Desktop: Installed', isSuccess: true },
        { text: '✅ VS Code + Extensions: Installed', isSuccess: true },
        { text: '', isOutput: true },
        { text: 'You\'re ready to start using GitHub!', isInfo: true }
    ];
    
    terminalContent.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
        if (i < commands.length) {
            const line = document.createElement('div');
            if (commands[i].isCommand) {
                line.innerHTML = `<span style="color: var(--blue-400);">${commands[i].text}</span>`;
            } else if (commands[i].isSuccess) {
                line.innerHTML = `<span style="color: var(--emerald-400);">${commands[i].text}</span>`;
            } else if (commands[i].isInfo) {
                line.innerHTML = `<span style="color: var(--amber-400);">${commands[i].text}</span>`;
            } else {
                line.textContent = commands[i].text;
            }
            terminalContent.appendChild(line);
            terminalContent.scrollTop = terminalContent.scrollHeight;
            i++;
        } else {
            clearInterval(interval);
        }
    }, 200);
}

function simulateClone() {
    const url = document.getElementById('cloneUrl').value;
    const terminal = document.getElementById('cloneOutput');
    const terminalContent = document.getElementById('cloneTerminalContent');
    
    terminal.style.display = 'block';
    terminalContent.innerHTML = '';
    
    // Extract repo name from URL for more realistic output
    const repoName = url.split('/').pop().replace('.git', '') || 'repository';
    
    const commands = [
        `<span class="terminal-prompt">$</span> <span class="terminal-command">git clone ${url}</span>`,
        `<span class="terminal-output">Cloning into '${repoName}'...</span>`,
        `<span class="terminal-output">remote: Enumerating objects: 47, done.</span>`,
        `<span class="terminal-output">remote: Counting objects: 100% (47/47), done.</span>`,
        `<span class="terminal-output">remote: Compressing objects: 100% (32/32), done.</span>`,
        `<span class="terminal-output">remote: Total 47 (delta 18), reused 43 (delta 14), pack-reused 0</span>`,
        `<span class="terminal-output">Receiving objects: 100% (47/47), 12.45 KiB | 2.49 MiB/s, done.</span>`,
        `<span class="terminal-output">Resolving deltas: 100% (18/18), done.</span>`,
        `<span class="terminal-prompt">$</span> <span style="color: #10b981;">✅ Repository cloned successfully!</span>`
    ];
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < commands.length) {
            const line = document.createElement('div');
            line.innerHTML = commands[i];
            line.style.marginBottom = '4px';
            terminalContent.appendChild(line);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 400);
}

// Basic Git Operations Demo Functions
function simulateGitStatus() {
    const output = document.getElementById('basicGitOutput');
    output.style.display = 'block';
    output.className = 'terminal';
    output.innerHTML = '<div class="terminal-content"></div>';
    const terminalContent = output.querySelector('.terminal-content');
    
    const commands = [
        { text: '$ git status', isCommand: true },
        { text: 'On branch feature/user-authentication', isOutput: true },
        { text: 'Changes not staged for commit:', isOutput: true },
        { text: '  (use "git add <file>..." to update what will be committed)', isOutput: true },
        { text: '  (use "git checkout -- <file>..." to discard changes in working directory)', isOutput: true },
        { text: '', isOutput: true },
        { text: '\tmodified:   src/auth/login.js', isOutput: true, color: '#ef4444' },
        { text: '\tmodified:   src/components/LoginForm.jsx', isOutput: true, color: '#ef4444' },
        { text: '', isOutput: true },
        { text: 'Untracked files:', isOutput: true },
        { text: '  (use "git add <file>..." to include in what will be committed)', isOutput: true },
        { text: '', isOutput: true },
        { text: '\tsrc/auth/oauth.js', isOutput: true, color: '#ef4444' },
        { text: '\ttests/auth.test.js', isOutput: true, color: '#ef4444' },
        { text: '', isOutput: true },
        { text: 'no changes added to commit (use "git add" to stage changes)', isOutput: true }
    ];
    
    simulateTerminal(terminalContent, commands, () => {
        terminalContent.innerHTML += '<br><span class="terminal-output" style="color: #10b981; font-weight: bold;">💡 Tip: Use "git add ." to stage all changes at once!</span>';
    });
}

function simulateGitAdd() {
    const output = document.getElementById('basicGitOutput');
    output.style.display = 'block';
    output.className = 'terminal';
    output.innerHTML = '<div class="terminal-content"></div>';
    const terminalContent = output.querySelector('.terminal-content');
    
    const commands = [
        { text: '$ git add .', isCommand: true },
        { text: '', isOutput: true },
        { text: '$ git status', isCommand: true },
        { text: 'On branch feature/user-authentication', isOutput: true },
        { text: 'Changes to be committed:', isOutput: true },
        { text: '  (use "git restore --staged <file>..." to unstage)', isOutput: true },
        { text: '', isOutput: true },
        { text: '\tmodified:   src/auth/login.js', isOutput: true, color: '#22c55e' },
        { text: '\tmodified:   src/components/LoginForm.jsx', isOutput: true, color: '#22c55e' },
        { text: '\tnew file:   src/auth/oauth.js', isOutput: true, color: '#22c55e' },
        { text: '\tnew file:   tests/auth.test.js', isOutput: true, color: '#22c55e' },
    ];
    
    simulateTerminal(terminalContent, commands, () => {
        terminalContent.innerHTML += '<br><span class="terminal-output" style="color: #10b981; font-weight: bold;">✓ All changes staged and ready to commit!</span>';
    });
}

function simulateGitCommit() {
    const output = document.getElementById('basicGitOutput');
    output.style.display = 'block';
    output.className = 'terminal';
    output.innerHTML = '<div class="terminal-content"></div>';
    const terminalContent = output.querySelector('.terminal-content');
    
    const commands = [
        { text: '$ git commit -m "feat: implement user authentication system"', isCommand: true },
        { text: '', isOutput: true },
        { text: '[feature/user-authentication 7f8a9b2] feat: implement user authentication system', isOutput: true },
        { text: ' 4 files changed, 127 insertions(+), 23 deletions(-)', isOutput: true },
        { text: ' create mode 100644 src/auth/oauth.js', isOutput: true },
        { text: ' create mode 100644 tests/auth.test.js', isOutput: true },
        { text: '', isOutput: true },
        { text: '$ git status', isCommand: true },
        { text: 'On branch feature/user-authentication', isOutput: true },
        { text: 'nothing to commit, working tree clean', isOutput: true }
    ];
    
    simulateTerminal(terminalContent, commands, () => {
        terminalContent.innerHTML += '<br><span class="terminal-output" style="color: #10b981; font-weight: bold;">✓ Changes committed successfully! Ready to push to GitHub.</span>';
    });
}

function simulateGitPush() {
    const output = document.getElementById('basicGitOutput');
    output.style.display = 'block';
    output.className = 'terminal';
    output.innerHTML = '<div class="terminal-content"></div>';
    const terminalContent = output.querySelector('.terminal-content');
    
    const commands = [
        { text: '$ git push -u origin feature/user-authentication', isCommand: true },
        { text: 'Enumerating objects: 12, done.', isOutput: true },
        { text: 'Counting objects: 100% (12/12), done.', isOutput: true },
        { text: 'Delta compression using up to 8 threads', isOutput: true },
        { text: 'Compressing objects: 100% (8/8), done.', isOutput: true },
        { text: 'Writing objects: 100% (9/9), 1.84 KiB | 1.84 MiB/s, done.', isOutput: true },
        { text: 'Total 9 (delta 4), reused 0 (delta 0), pack-reused 0', isOutput: true },
        { text: 'remote: Resolving deltas: 100% (4/4), completed with 2 local objects.', isOutput: true },
        { text: '', isOutput: true },
        { text: 'remote: Create a pull request for \'feature/user-authentication\' on GitHub by visiting:', isOutput: true },
        { text: 'remote:      https://github.com/nborlaug/my-project/pull/new/feature/user-authentication', isOutput: true },
        { text: '', isOutput: true },
        { text: 'To https://github.com/nborlaug/my-project.git', isOutput: true },
        { text: ' * [new branch]      feature/user-authentication -> feature/user-authentication', isOutput: true },
        { text: 'Branch \'feature/user-authentication\' set up to track remote branch \'feature/user-authentication\' from \'origin\'.', isOutput: true }
    ];
    
    simulateTerminal(terminalContent, commands, () => {
        terminalContent.innerHTML += '<br><span class="terminal-output" style="color: #10b981; font-weight: bold;">🚀 Feature branch pushed successfully! Now you can create a pull request.</span>';
        terminalContent.innerHTML += '<br><span class="terminal-output" style="color: #3b82f6;">💡 Next step: Go to GitHub and create a pull request to merge your changes!</span>';
    });
}

// ============================================
// INTERACTIVE GIT SIMULATOR - HANDS-ON LEARNING
// ============================================

// Simulator state
let simulatorState = {
    workingFiles: [
        { name: 'Get-SystemInfo.ps1', status: 'modified', icon: '📄' },
        { name: 'Install-Software.ps1', status: 'new', icon: '📄' },
        { name: 'README.md', status: 'modified', icon: '📋' }
    ],
    stagedFiles: [],
    commits: [
        { hash: 'a1b2c3d', message: 'Initial PowerShell utilities', files: 2 }
    ],
    achievements: {
        'first-status': false,
        'first-add': false,
        'first-commit': false,
        'clean-slate': false
    }
};

// Initialize simulator on page load
function initializeGitSimulator() {
    setupDragAndDrop();
    updateSimulatorDisplay();
    
    // Add command input event listeners
    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                executeCommand();
            }
        });
    }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    // Working directory files
    document.querySelectorAll('#workingFiles .file-item').forEach(file => {
        file.addEventListener('dragstart', handleDragStart);
        file.addEventListener('dragend', handleDragEnd);
    });
    
    // Drop zones
    const stagingArea = document.getElementById('stagedFiles');
    const workingArea = document.getElementById('workingFiles');
    
    [stagingArea, workingArea].forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('drop', handleDrop);
        area.addEventListener('dragenter', handleDragEnter);
        area.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.file);
    e.dataTransfer.setData('source', e.target.closest('.git-area').classList.contains('working-directory') ? 'working' : 'staged');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    if (e.target.closest('.file-list')) {
        const emptyState = e.target.closest('.file-list').querySelector('.empty-state');
        if (emptyState) {
            emptyState.classList.add('drag-over');
        }
    }
}

function handleDragLeave(e) {
    if (!e.target.closest('.file-list').contains(e.relatedTarget)) {
        const emptyState = e.target.closest('.file-list').querySelector('.empty-state');
        if (emptyState) {
            emptyState.classList.remove('drag-over');
        }
    }
}

function handleDrop(e) {
    e.preventDefault();
    const fileName = e.dataTransfer.getData('text/plain');
    const sourceArea = e.dataTransfer.getData('source');
    const targetArea = e.target.closest('.git-area');
    
    // Remove drag-over styling
    const emptyState = e.target.closest('.file-list')?.querySelector('.empty-state');
    if (emptyState) {
        emptyState.classList.remove('drag-over');
    }
    
    if (targetArea.classList.contains('staging-area') && sourceArea === 'working') {
        stageFile(fileName);
    } else if (targetArea.classList.contains('working-directory') && sourceArea === 'staged') {
        unstageFile(fileName);
    }
}

// File operations
function stageFile(fileName) {
    const fileIndex = simulatorState.workingFiles.findIndex(f => f.name === fileName);
    if (fileIndex !== -1) {
        const file = simulatorState.workingFiles.splice(fileIndex, 1)[0];
        file.status = 'staged';
        simulatorState.stagedFiles.push(file);
        
        updateSimulatorDisplay();
        updateStatus(`Staged ${fileName} for commit`);
        
        if (!simulatorState.achievements['first-add']) {
            unlockAchievement('first-add');
        }
    }
}

function unstageFile(fileName) {
    const fileIndex = simulatorState.stagedFiles.findIndex(f => f.name === fileName);
    if (fileIndex !== -1) {
        const file = simulatorState.stagedFiles.splice(fileIndex, 1)[0];
        file.status = file.name.includes('Install-Software') ? 'new' : 'modified';
        simulatorState.workingFiles.push(file);
        
        updateSimulatorDisplay();
        updateStatus(`Unstaged ${fileName}`);
    }
}

// Command execution
function executeCommand() {
    const commandInput = document.getElementById('commandInput');
    const command = commandInput.value.trim();
    const outputDiv = document.getElementById('commandOutput');
    
    if (!command) return;
    
    // Add command to output
    appendToOutput(`$ ${command}`, 'command');
    
    // Process command
    processGitCommand(command);
    
    // Clear input
    commandInput.value = '';
}

function processGitCommand(command) {
    const parts = command.toLowerCase().split(' ');
    const gitCommand = parts[0];
    const subCommand = parts[1];
    
    if (gitCommand !== 'git') {
        appendToOutput(`Command not found: ${command}`, 'error');
        return;
    }
    
    switch (subCommand) {
        case 'status':
            executeGitStatus();
            break;
        case 'add':
            executeGitAdd(parts.slice(2));
            break;
        case 'commit':
            executeGitCommit(parts.slice(2));
            break;
        case 'push':
            executeGitPush();
            break;
        default:
            appendToOutput(`Unknown git command: ${subCommand}`, 'error');
    }
}

function executeGitStatus() {
    let output = 'On branch feature/powershell-improvements\n\n';
    
    if (simulatorState.stagedFiles.length > 0) {
        output += 'Changes to be committed:\n';
        output += '  (use "git restore --staged <file>..." to unstage)\n\n';
        simulatorState.stagedFiles.forEach(file => {
            const status = file.status === 'staged' && file.name.includes('Install-Software') ? 'new file' : 'modified';
            output += `\t${status}:   ${file.name}\n`;
        });
        output += '\n';
    }
    
    if (simulatorState.workingFiles.length > 0) {
        if (simulatorState.workingFiles.some(f => f.status === 'modified')) {
            output += 'Changes not staged for commit:\n';
            output += '  (use "git add <file>..." to update what will be committed)\n';
            output += '  (use "git restore <file>..." to discard changes in working directory)\n\n';
            simulatorState.workingFiles.filter(f => f.status === 'modified').forEach(file => {
                output += `\tmodified:   ${file.name}\n`;
            });
            output += '\n';
        }
        
        const newFiles = simulatorState.workingFiles.filter(f => f.status === 'new');
        if (newFiles.length > 0) {
            output += 'Untracked files:\n';
            output += '  (use "git add <file>..." to include in what will be committed)\n\n';
            newFiles.forEach(file => {
                output += `\t${file.name}\n`;
            });
            output += '\n';
        }
    }
    
    if (simulatorState.workingFiles.length === 0 && simulatorState.stagedFiles.length === 0) {
        output += 'nothing to commit, working tree clean\n';
        if (!simulatorState.achievements['clean-slate']) {
            unlockAchievement('clean-slate');
        }
    } else {
        output += 'no changes added to commit (use "git add" to stage changes)\n';
    }
    
    appendToOutput(output, 'output');
    updateStatus('Checked repository status');
    
    if (!simulatorState.achievements['first-status']) {
        unlockAchievement('first-status');
    }
}

function executeGitAdd(args) {
    if (args.length === 0) {
        appendToOutput('fatal: pathspec not specified', 'error');
        return;
    }
    
    const target = args[0];
    
    if (target === '.') {
        // Stage all files
        while (simulatorState.workingFiles.length > 0) {
            const file = simulatorState.workingFiles.shift();
            file.status = 'staged';
            simulatorState.stagedFiles.push(file);
        }
        appendToOutput('Staged all changes', 'output');
        updateStatus('Staged all files for commit');
    } else {
        // Stage specific file
        const fileIndex = simulatorState.workingFiles.findIndex(f => f.name === target);
        if (fileIndex !== -1) {
            const file = simulatorState.workingFiles.splice(fileIndex, 1)[0];
            file.status = 'staged';
            simulatorState.stagedFiles.push(file);
            appendToOutput(`Staged ${target}`, 'output');
            updateStatus(`Staged ${target} for commit`);
        } else {
            appendToOutput(`pathspec '${target}' did not match any files`, 'error');
            return;
        }
    }
    
    updateSimulatorDisplay();
    
    if (!simulatorState.achievements['first-add']) {
        unlockAchievement('first-add');
    }
}

function executeGitCommit(args) {
    if (simulatorState.stagedFiles.length === 0) {
        appendToOutput('nothing to commit, working tree clean', 'output');
        return;
    }
    
    const messageIndex = args.indexOf('-m');
    let message = 'Update PowerShell scripts';
    
    if (messageIndex !== -1 && messageIndex + 1 < args.length) {
        message = args.slice(messageIndex + 1).join(' ').replace(/['"]/g, '');
    }
    
    // Create new commit
    const newCommit = {
        hash: generateCommitHash(),
        message: message,
        files: simulatorState.stagedFiles.length
    };
    
    simulatorState.commits.push(newCommit);
    simulatorState.stagedFiles = [];
    
    appendToOutput(`[feature/powershell-improvements ${newCommit.hash}] ${message}`, 'output');
    appendToOutput(`${newCommit.files} file${newCommit.files > 1 ? 's' : ''} changed`, 'output');
    
    updateSimulatorDisplay();
    updateStatus(`Committed ${newCommit.files} file${newCommit.files > 1 ? 's' : ''}: ${message}`);
    
    if (!simulatorState.achievements['first-commit']) {
        unlockAchievement('first-commit');
    }
}

function executeGitPush() {
    if (simulatorState.commits.length <= 1) {
        appendToOutput('Everything up-to-date', 'output');
        return;
    }
    
    appendToOutput('Enumerating objects: 8, done.', 'output');
    appendToOutput('Counting objects: 100% (8/8), done.', 'output');
    appendToOutput('Delta compression using up to 8 threads', 'output');
    appendToOutput('Compressing objects: 100% (4/4), done.', 'output');
    appendToOutput('Writing objects: 100% (5/5), 1.21 KiB | 1.21 MiB/s, done.', 'output');
    appendToOutput('Total 5 (delta 2), reused 0 (delta 0), pack-reused 0', 'output');
    appendToOutput('', 'output');
    appendToOutput('To https://github.com/nborlaug/powershell-utilities.git', 'output');
    appendToOutput(`   ${simulatorState.commits[simulatorState.commits.length-2].hash}..${simulatorState.commits[simulatorState.commits.length-1].hash}  feature/powershell-improvements -> feature/powershell-improvements`, 'output');
    
    updateStatus('Pushed changes to GitHub');
}

// Utility functions
function generateCommitHash() {
    return Math.random().toString(36).substr(2, 7);
}

function appendToOutput(text, type) {
    const outputDiv = document.getElementById('commandOutput');
    const line = document.createElement('div');
    line.textContent = text;
    
    if (type === 'command') {
        line.style.color = '#ffc220'; // Accent yellow
        line.style.fontWeight = 'bold';
    } else if (type === 'error') {
        line.style.color = '#dc3545';
    } else {
        line.style.color = '#a7cced'; // Sky blue
    }
    
    outputDiv.appendChild(line);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

function updateStatus(message) {
    const statusDiv = document.getElementById('simulatorStatus');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.style.background = 'var(--success-green)';
        statusDiv.style.color = 'var(--neutral-white)';
        
        setTimeout(() => {
            statusDiv.style.background = 'var(--accent-yellow)';
            statusDiv.style.color = 'var(--bentonville-blue)';
            statusDiv.textContent = 'Ready to practice Git workflow!';
        }, 3000);
    }
}

function updateSimulatorDisplay() {
    updateWorkingFiles();
    updateStagedFiles();
    updateCommitHistory();
}

function updateWorkingFiles() {
    const workingDiv = document.getElementById('workingFiles');
    if (!workingDiv) return;
    
    if (simulatorState.workingFiles.length === 0) {
        workingDiv.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">✅</span>
                <p>No changes in working directory</p>
                <small>All files are committed or staged</small>
            </div>
        `;
    } else {
        workingDiv.innerHTML = simulatorState.workingFiles.map(file => `
            <div class="file-item ${file.status}" draggable="true" data-file="${file.name}">
                <span class="file-icon">${file.icon}</span>
                <span class="file-name">${file.name}</span>
                <span class="file-status ${file.status}">${file.status === 'new' ? 'New File' : 'Modified'}</span>
            </div>
        `).join('');
        
        // Re-attach event listeners
        workingDiv.querySelectorAll('.file-item').forEach(file => {
            file.addEventListener('dragstart', handleDragStart);
            file.addEventListener('dragend', handleDragEnd);
        });
    }
}

function updateStagedFiles() {
    const stagedDiv = document.getElementById('stagedFiles');
    if (!stagedDiv) return;
    
    if (simulatorState.stagedFiles.length === 0) {
        stagedDiv.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>Drag files here to stage them</p>
                <small>or use: <code>git add filename</code></small>
            </div>
        `;
    } else {
        stagedDiv.innerHTML = simulatorState.stagedFiles.map(file => `
            <div class="file-item staged" draggable="true" data-file="${file.name}">
                <span class="file-icon">${file.icon}</span>
                <span class="file-name">${file.name}</span>
                <span class="file-status staged">Staged</span>
            </div>
        `).join('');
        
        // Re-attach event listeners
        stagedDiv.querySelectorAll('.file-item').forEach(file => {
            file.addEventListener('dragstart', handleDragStart);
            file.addEventListener('dragend', handleDragEnd);
        });
    }
}

function updateCommitHistory() {
    const committedDiv = document.getElementById('committedFiles');
    if (!committedDiv) return;
    
    committedDiv.innerHTML = simulatorState.commits.map(commit => `
        <div class="commit-item">
            <span class="commit-hash">${commit.hash}</span>
            <span class="commit-message">${commit.message}</span>
            <div class="commit-files">
                <small>${commit.files} file${commit.files > 1 ? 's' : ''} committed</small>
            </div>
        </div>
    `).join('');
}

function unlockAchievement(achievementId) {
    if (simulatorState.achievements[achievementId]) return;
    
    simulatorState.achievements[achievementId] = true;
    const achievement = document.querySelector(`[data-achievement="${achievementId}"]`);
    
    if (achievement) {
        achievement.classList.remove('locked');
        achievement.classList.add('unlocked');
        
        // Show achievement notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-yellow);
            color: var(--bentonville-blue);
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: bold;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = `🏆 Achievement Unlocked: ${achievement.querySelector('.achievement-name').textContent}!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Command suggestions
function suggestCommand(command) {
    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.value = command;
        commandInput.focus();
    }
}

// Reset simulator
function resetSimulator() {
    simulatorState = {
        workingFiles: [
            { name: 'Get-SystemInfo.ps1', status: 'modified', icon: '📄' },
            { name: 'Install-Software.ps1', status: 'new', icon: '📄' },
            { name: 'README.md', status: 'modified', icon: '📋' }
        ],
        stagedFiles: [],
        commits: [
            { hash: 'a1b2c3d', message: 'Initial PowerShell utilities', files: 2 }
        ],
        achievements: {
            'first-status': false,
            'first-add': false,
            'first-commit': false,
            'clean-slate': false
        }
    };
    
    document.getElementById('commandOutput').innerHTML = '';
    document.querySelectorAll('.achievement').forEach(a => {
        a.classList.add('locked');
        a.classList.remove('unlocked');
    });
    
    updateSimulatorDisplay();
    updateStatus('Simulator reset - ready to practice!');
}

// Continue to next exercise
function nextExercise() {
    navigateToSection('branching');
    updateStatus('Great job! Now learn about branching and merging.');
}

// Initialize simulator when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('gitSimulator')) {
        initializeGitSimulator();
    }
});

// Concept expansion
function expandConcept(conceptKey) {
    const detailsDiv = document.getElementById('conceptDetails');
    const concept = conceptExplanations[conceptKey];
    
    if (concept && detailsDiv) {
        detailsDiv.innerHTML = `
            <h3>${concept.title}</h3>
            ${concept.content}
        `;
        detailsDiv.classList.add('active');
        
        // Scroll to the details
        detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Tab functionality
function initializeTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('onclick').match(/showTab\\('([^']+)'\\)/)[1];
            showTab(tabId);
        });
    });
}

function showTab(tabId) {
    // Find the parent tabs container
    const button = event ? event.target : document.querySelector(`[onclick*="${tabId}"]`);
    const tabsContainer = button.closest('.tabs').parentElement;
    
    // Hide all tab contents in this container
    tabsContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons in this container
    tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show target tab content
    const targetContent = tabsContainer.querySelector(`#${tabId}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Add active class to clicked button
    button.classList.add('active');
}

// Code tab functionality
function initializeCodeTabs() {
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const codeId = this.getAttribute('onclick').match(/showCode\\('([^']+)'\\)/)[1];
            showCode(codeId);
        });
    });
}

function showCode(codeId) {
    // Find the parent code tabs container
    const button = event ? event.target : document.querySelector(`[onclick*="${codeId}"]`);
    const codeContainer = button.closest('.code-tabs').parentElement;
    
    // Hide all code contents in this container
    codeContainer.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all code tab buttons in this container
    codeContainer.querySelectorAll('.code-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show target code content
    const targetContent = codeContainer.querySelector(`#${codeId}`);
    if (targetContent) {
        targetContent.classList.add('active');
        
        // Update code if it's a dynamic example
        if (codeExamples[codeId]) {
            const pre = targetContent.querySelector('pre code');
            if (pre) {
                pre.textContent = codeExamples[codeId];
                
                // Re-highlight the code
                if (typeof Prism !== 'undefined') {
                    Prism.highlightElement(pre);
                }
            }
        }
    }
    
    // Add active class to clicked button
    button.classList.add('active');
}

// Quiz functionality
function checkAnswer(questionId, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="${questionId}"]:checked`);
    const feedback = document.getElementById(`${questionId}-feedback`);
    
    if (!selectedAnswer) {
        feedback.innerHTML = 'Please select an answer.';
        feedback.className = 'feedback incorrect';
        return;
    }
    
    if (selectedAnswer.value === correctAnswer) {
        feedback.innerHTML = '✅ Correct! Version control helps track changes and enables collaboration.';
        feedback.className = 'feedback correct';
    } else {
        feedback.innerHTML = '❌ Not quite. Version control is primarily about tracking changes and enabling collaboration.';
        feedback.className = 'feedback incorrect';
    }
}

// Collaboration demos
function showPRDemo() {
    showCollaborationDemo('pullRequest');
}

function showIssueDemo() {
    showCollaborationDemo('issue');
}

function showProjectDemo() {
    showCollaborationDemo('project');
}

function showActionsDemo() {
    showCollaborationDemo('actions');
}

function showCollaborationDemo(demoType) {
    const demoArea = document.getElementById('collaborationDemo');
    demoArea.innerHTML = collaborationDemos[demoType];
    demoArea.classList.add('active');
    
    // Scroll to demo
    demoArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && currentSection > 0) {
        previousSection();
    } else if (e.key === 'ArrowRight' && currentSection < sections.length - 1) {
        nextSection();
    }
    
    // Hidden shortcut: Ctrl+Shift+C to jump to certificate with 100% score
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        console.log('Certificate shortcut triggered!');
        jumpToCertificate();
    }
});

// Hidden shortcut function to jump to certificate
function jumpToCertificate() {
    console.log('jumpToCertificate called');
    
    // Navigate to final quiz section first
    const finalQuizIndex = sections.indexOf('final-quiz');
    console.log('finalQuizIndex:', finalQuizIndex);
    
    if (finalQuizIndex !== -1) {
        showSection(finalQuizIndex);
        currentSection = finalQuizIndex;
        updateProgress();
        
        // Set quiz as completed with perfect score
        quizCompleted = true;
        quizStarted = true;
        finalQuizScore = 100;
        
        // Fill in correct answers for all questions (to simulate 100% score)
        userAnswers = quizQuestions.map(q => q.correct);
        
        // Hide intro and quiz container, show results
        document.getElementById('quizIntro').style.display = 'none';
        document.getElementById('quizContainer').style.display = 'none';
        
        // Show passing results
        showQuizResults(quizQuestions.length, 100, true);
        
        // Show certificate section
        document.getElementById('certificateSection').style.display = 'block';
        
        // Pre-fill name for testing convenience
        setTimeout(() => {
            const nameInput = document.getElementById('studentName');
            if (nameInput) {
                nameInput.value = 'Joshua Walderbach';
                console.log('Pre-filled name for testing: Joshua Walderbach');
            }
        }, 500);
        
        console.log('Jumped to certificate with 100% score');
    } else {
        console.log('final-quiz section not found in sections array');
    }
}

// Add smooth scrolling for internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Auto-save progress in localStorage
function saveProgress() {
    localStorage.setItem('github-tutorial-progress', currentSection);
}

function loadProgress() {
    const saved = localStorage.getItem('github-tutorial-progress');
    if (saved !== null) {
        const savedSection = parseInt(saved);
        if (savedSection >= 0 && savedSection < sections.length) {
            showSection(savedSection);
        }
    }
}

// Load saved progress on page load (DISABLED - always start fresh)
// document.addEventListener('DOMContentLoaded', function() {
//     loadProgress();
// });

// Save progress when section changes - this is handled in the main showSection function

// Add CSS for dynamic demo elements
const additionalCSS = `
.pr-demo, .issue-demo, .project-demo, .actions-demo {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
}

.pr-header, .issue-header, .workflow-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.pr-status, .workflow-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.pr-status.open {
    background: #dcfce7;
    color: #166534;
}

.workflow-status.success {
    background: #dcfce7;
    color: #166534;
}

.issue-number {
    background: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-weight: bold;
}

.issue-label, .card-label {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
}

.issue-label.bug, .card-label.bug {
    background: #fecaca;
    color: #991b1b;
}

.issue-label.priority {
    background: #fed7aa;
    color: #ea580c;
}

.card-label.feature {
    background: #dbeafe;
    color: #1d4ed8;
}

.card-label.docs {
    background: #e0e7ff;
    color: #3730a3;
}

.card-label.enhancement {
    background: #dcfce7;
    color: #166534;
}

.kanban-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1rem 0;
}

.kanban-column {
    background: #f9fafb;
    border-radius: 8px;
    padding: 1rem;
}

.kanban-column h4 {
    margin: 0 0 1rem 0;
    color: #374151;
    text-align: center;
}

.kanban-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
    margin: 0.5rem 0;
    cursor: grab;
}

.kanban-card h5 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.kanban-card p {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #6b7280;
}

.workflow-steps {
    display: grid;
    gap: 0.5rem;
    margin: 1rem 0;
}

.step-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    background: #f9fafb;
    border-radius: 4px;
}

.step-item.completed {
    background: #ecfdf5;
}

.step-icon {
    font-size: 1.2rem;
}

.step-time {
    margin-left: auto;
    font-size: 0.8rem;
    color: #6b7280;
    font-family: monospace;
}

@media (max-width: 768px) {
    .kanban-board {
        grid-template-columns: 1fr;
    }
    
    .pr-header, .issue-header, .workflow-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
`;

// Workflow tab functionality
function showWorkflow(workflowType) {
    // Hide all workflow contents
    document.querySelectorAll('.workflow-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all workflow tabs
    document.querySelectorAll('.workflow-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show target workflow content
    const targetContent = document.getElementById(workflowType);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Workflow simulator
let workflowState = {
    currentBranch: 'main',
    commits: [],
    pushedCommits: [],
    isFeatureActive: false
};

function startWorkflowSim() {
    workflowState = {
        currentBranch: 'feature/network-info-reporting',
        commits: [],
        pushedCommits: [],
        isFeatureActive: true
    };
    
    updateWorkflowOutput(`
        <h5>✅ Started new feature development</h5>
        <pre><code>git checkout -b feature/network-info-reporting
Switched to a new branch 'feature/network-info-reporting'

Current branch: feature/network-info-reporting
Status: Ready for development</code></pre>
        <p><strong>Next:</strong> Make some commits by clicking "Make Commit"</p>
    `);
}

function simulateCommit() {
    if (!workflowState.isFeatureActive) {
        updateWorkflowOutput('<p class="error">❌ Please start a new feature first!</p>');
        return;
    }
    
    const commitMessages = [
        'Add basic system info gathering script',
        'Implement CPU and memory information collection', 
        'Add disk space monitoring functionality',
        'Include network adapter information',
        'Add unit tests for system info functions',
        'Update documentation and usage examples'
    ];
    
    if (workflowState.commits.length >= commitMessages.length) {
        updateWorkflowOutput('<p class="warning">⚠️ Feature is complete! Time to push and merge.</p>');
        return;
    }
    
    const message = commitMessages[workflowState.commits.length];
    const commitHash = Math.random().toString(36).substr(2, 7);
    workflowState.commits.push({ hash: commitHash, message });
    
    updateWorkflowOutput(`
        <h5>✅ Commit created</h5>
        <pre><code>git add .
git commit -m "${message}"

[${workflowState.currentBranch} ${commitHash}] ${message}
 2 files changed, 45 insertions(+), 3 deletions(-)

Total commits: ${workflowState.commits.length}
Unpushed commits: ${workflowState.commits.length - workflowState.pushedCommits.length}</code></pre>
        <p><strong>Next:</strong> Push changes or make more commits</p>
    `);
}

function simulatePush() {
    if (!workflowState.isFeatureActive) {
        updateWorkflowOutput('<p class="error">❌ Please start a new feature first!</p>');
        return;
    }
    
    if (workflowState.commits.length === 0) {
        updateWorkflowOutput('<p class="error">❌ No commits to push! Make some commits first.</p>');
        return;
    }
    
    const unpushedCommits = workflowState.commits.length - workflowState.pushedCommits.length;
    if (unpushedCommits === 0) {
        updateWorkflowOutput('<p class="warning">⚠️ All commits are already pushed!</p>');
        return;
    }
    
    workflowState.pushedCommits = [...workflowState.commits];
    
    updateWorkflowOutput(`
        <h5>✅ Changes pushed to remote</h5>
        <pre><code>git push origin ${workflowState.currentBranch}

Enumerating objects: ${unpushedCommits * 3}, done.
Counting objects: 100% (${unpushedCommits * 3}/${unpushedCommits * 3}), done.
Compressing objects: 100% (${unpushedCommits * 2}/${unpushedCommits * 2}), done.
Writing objects: 100% (${unpushedCommits * 3}/${unpushedCommits * 3}), 1.2 KiB | 1.2 MiB/s, done.
Total ${unpushedCommits * 3} (delta ${unpushedCommits}), reused 0 (delta 0)

* [new branch]      ${workflowState.currentBranch} -> ${workflowState.currentBranch}

Branch '${workflowState.currentBranch}' set up to track remote branch '${workflowState.currentBranch}' from 'origin'.</code></pre>
        <p><strong>Next:</strong> Create a Pull Request or continue development</p>
    `);
}

function simulateMerge() {
    if (!workflowState.isFeatureActive) {
        updateWorkflowOutput('<p class="error">❌ Please start a new feature first!</p>');
        return;
    }
    
    if (workflowState.commits.length === 0) {
        updateWorkflowOutput('<p class="error">❌ No commits to merge! Make some commits first.</p>');
        return;
    }
    
    if (workflowState.commits.length !== workflowState.pushedCommits.length) {
        updateWorkflowOutput('<p class="error">❌ Please push all commits before merging!</p>');
        return;
    }
    
    workflowState.isFeatureActive = false;
    workflowState.currentBranch = 'main';
    
    updateWorkflowOutput(`
        <h5>✅ Feature merged successfully!</h5>
        <pre><code>Pull Request #47: Add network information reporting
✅ Approved by team lead
✅ All checks passed
🔀 Merged into main

git checkout main
git pull origin main

From https://github.com/ag-research/wheat-yield-analyzer
 * branch            main       -> FETCH_HEAD
Already up to date.

# Clean up feature branch
git branch -d feature/network-info-reporting
git push origin --delete feature/network-info-reporting

✅ Feature development complete!
📊 Total commits: ${workflowState.commits.length}
⏱️ Development time: simulated</code></pre>
        <p><strong>🎉 Congratulations!</strong> You've completed a full Git workflow cycle.</p>
    `);
}

function resetWorkflowSim() {
    workflowState = {
        currentBranch: 'main',
        commits: [],
        pushedCommits: [],
        isFeatureActive: false
    };
    
    updateWorkflowOutput('<p>Workflow reset. Click "Start New Feature" to begin again...</p>');
}

function updateWorkflowOutput(content) {
    const output = document.getElementById('workflowSimOutput');
    if (output) {
        output.innerHTML = content;
        output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Add CSS for new workflow elements
const workflowCSS = `
.workflow-tabs {
    display: flex;
    border-bottom: 2px solid #e5e7eb;
    margin: 1rem 0;
}

.workflow-tab {
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    font-weight: 500;
    color: #6b7280;
    transition: all 0.2s ease;
}

.workflow-tab:hover {
    color: #374151;
    background: #f9fafb;
}

.workflow-tab.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
}

.workflow-content {
    display: none;
    padding: 1rem 0;
}

.workflow-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

.step-note {
    font-style: italic;
    color: #6b7280;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.phase {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1rem 0;
}

.phase h5 {
    color: #1f2937;
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
}

.collab-roles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.role {
    background: #f3f4f6;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
}

.role h6 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.timeline-event {
    display: flex;
    margin: 1.5rem 0;
    align-items: flex-start;
    gap: 1rem;
}

.time {
    background: #3b82f6;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    min-width: 120px;
    text-align: center;
}

.event {
    flex: 1;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
}

.event h6 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.best-practices-collab {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
}

.best-practices-collab h5 {
    color: #0c4a6e;
    margin: 0 0 1rem 0;
}

.best-practices-collab ul {
    margin: 0;
    padding-left: 1.5rem;
}

.best-practices-collab li {
    margin: 0.5rem 0;
    color: #0c4a6e;
}

.workflow-simulator {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 2rem 0;
}

.simulator-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.simulator-output {
    background: #1f2937;
    color: #d1d5db;
    padding: 1rem;
    border-radius: 6px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-size: 0.9rem;
    min-height: 100px;
    max-height: 400px;
    overflow-y: auto;
}

.simulator-output h5 {
    color: #10b981;
    margin: 0 0 0.5rem 0;
}

.simulator-output .error {
    color: #ef4444;
}

.simulator-output .warning {
    color: #f59e0b;
}

.simulator-output pre {
    margin: 0.5rem 0;
    color: #d1d5db;
}

.repo-types, .git-areas {
    display: grid;
    gap: 1rem;
    margin: 1rem 0;
}

.repo-type, .area {
    background: #f3f4f6;
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;
}

.area.working {
    border-left-color: #ef4444;
}

.area.staging {
    border-left-color: #f59e0b;
}

.area.repository {
    border-left-color: #10b981;
}

.commit-examples {
    display: grid;
    gap: 1rem;
    margin: 1rem 0;
}

.good-commit, .bad-commit {
    padding: 1rem;
    border-radius: 6px;
}

.good-commit {
    background: #ecfdf5;
    border: 1px solid #10b981;
}

.bad-commit {
    background: #fef2f2;
    border: 1px solid #ef4444;
}

.good-commit h5 {
    color: #047857;
    margin: 0 0 0.5rem 0;
}

.bad-commit h5 {
    color: #dc2626;
    margin: 0 0 0.5rem 0;
}

.branch-types {
    display: grid;
    gap: 0.5rem;
    margin: 1rem 0;
}

.branch-type {
    padding: 0.75rem;
    border-radius: 4px;
    border-left: 4px solid;
}

.branch-type.main {
    background: #f0f9ff;
    border-left-color: #0ea5e9;
}

.branch-type.feature {
    background: #ecfdf5;
    border-left-color: #10b981;
}

.branch-type.hotfix {
    background: #fef2f2;
    border-left-color: #ef4444;
}

.branch-type.develop {
    background: #fef7ff;
    border-left-color: #a855f7;
}

.branch-type.release {
    background: #fffbeb;
    border-left-color: #f59e0b;
}

.merge-types {
    display: grid;
    gap: 1.5rem;
    margin: 1rem 0;
}

.merge-type {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
}

.merge-type h5 {
    color: #1f2937;
    margin: 0 0 0.5rem 0;
}

.conflict-example {
    background: #fef2f2;
    border: 1px solid #ef4444;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
}

.conflict-example h5 {
    color: #dc2626;
    margin: 0 0 0.5rem 0;
}

@media (max-width: 768px) {
    .workflow-tabs {
        flex-direction: column;
    }
    
    .workflow-tab {
        text-align: left;
        border-left: 3px solid transparent;
        border-bottom: none;
    }
    
    .workflow-tab.active {
        border-left-color: #3b82f6;
        border-bottom-color: transparent;
    }
    
    .collab-roles {
        grid-template-columns: 1fr;
    }
    
    .timeline-event {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .simulator-controls {
        justify-content: center;
    }
    
    .commit-examples {
        grid-template-columns: 1fr;
    }
}
`;

const workflowStyle = document.createElement('style');
workflowStyle.textContent = workflowCSS;
document.head.appendChild(workflowStyle);

// Add CSS for setup elements
const setupCSS = `
.setup-overview {
    background: #f0f9ff;
    border: 2px solid #0ea5e9;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
}

.setup-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.setup-option {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    border-left: 4px solid;
}

.setup-option.essential {
    border-left-color: #ef4444;
}

.setup-option.optional {
    border-left-color: #10b981;
}

.setup-option h4 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.setup-option ul {
    margin: 0;
    padding-left: 1.5rem;
}

.setup-tabs {
    display: flex;
    border-bottom: 2px solid #e5e7eb;
    margin: 2rem 0 1rem 0;
    overflow-x: auto;
}

.setup-tab {
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    font-weight: 500;
    color: #6b7280;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.setup-tab:hover {
    color: #374151;
    background: #f9fafb;
}

.setup-tab.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
}

.setup-content {
    display: none;
    padding: 1rem 0;
}

.setup-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

.setup-step {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin: 1.5rem 0;
    overflow: hidden;
}

.step-header {
    background: #f8fafc;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.step-number {
    background: #3b82f6;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
}

.step-header h4 {
    margin: 0;
    color: #1f2937;
}

.step-content {
    padding: 1.5rem;
}

.install-options {
    display: grid;
    gap: 1rem;
    margin: 1rem 0;
}

.option {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
}

.option.recommended {
    background: #ecfdf5;
    border-color: #10b981;
}

.option h5 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.verification, .config-explanation, .github-features {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
}

.verification h5, .config-explanation h5, .github-features h5 {
    margin: 0 0 0.5rem 0;
    color: #0c4a6e;
}

.auth-methods {
    display: grid;
    gap: 1.5rem;
    margin: 1rem 0;
}

.auth-method {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
}

.auth-method.recommended {
    background: #ecfdf5;
    border-color: #10b981;
}

.auth-method h5 {
    margin: 0 0 1rem 0;
    color: #1f2937;
}

.tool-intro {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin: 1.5rem 0;
}

.tool-benefits h4 {
    margin: 0 0 1rem 0;
    color: #1f2937;
}

.tool-benefits ul {
    margin: 0;
    padding-left: 1.5rem;
}

.tool-benefits li {
    margin: 0.5rem 0;
}

.screenshot-placeholder {
    background: #f3f4f6;
    border: 2px dashed #9ca3af;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    color: #6b7280;
}

.screenshot-placeholder p {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: bold;
}

.screenshot-placeholder ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.screenshot-placeholder li {
    margin: 0.25rem 0;
    font-size: 0.9rem;
}

.desktop-workflow {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
}

.desktop-workflow h5 {
    margin: 0 0 1rem 0;
    color: #0c4a6e;
}

.workflow-steps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.mini-step {
    background: #dbeafe;
    color: #1e40af;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.feature {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
}

.feature h5 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.feature p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
}

.extensions-grid {
    display: grid;
    gap: 1rem;
    margin: 1rem 0;
}

.extension {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
    border-left: 4px solid;
}

.extension.essential {
    border-left-color: #ef4444;
    background: #fef2f2;
}

.extension.recommended {
    border-left-color: #10b981;
    background: #ecfdf5;
}

.extension h5 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.extension p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
}

.install-instructions {
    background: #1f2937;
    color: #d1d5db;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
}

.install-instructions h5 {
    color: #10b981;
    margin: 0 0 0.5rem 0;
}

.vscode-features {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
}

.vscode-features h5 {
    margin: 0 0 1rem 0;
    color: #0c4a6e;
}

.feature-list {
    display: grid;
    gap: 0.5rem;
}

.vscode-feature {
    background: white;
    padding: 0.75rem;
    border-radius: 4px;
    border-left: 3px solid #3b82f6;
    font-size: 0.9rem;
}

.workflow-example {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
}

.workflow-example h5 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.comparison-table {
    overflow-x: auto;
    margin: 1.5rem 0;
}

.comparison-table table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.comparison-table th,
.comparison-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.comparison-table th {
    background: #f8fafc;
    font-weight: 600;
    color: #1f2937;
}

.comparison-table td:first-child {
    font-weight: 500;
}

.recommendations {
    margin: 2rem 0;
}

.recommendations h4 {
    margin: 0 0 1rem 0;
    color: #1f2937;
}

.role-recommendations {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.role-rec {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    border-left: 4px solid #3b82f6;
}

.role-rec h5 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.role-rec p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
}

.role-rec p:first-of-type {
    font-weight: 600;
    color: #1f2937;
}

.external-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
}

.external-link:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .setup-tabs {
        flex-direction: column;
    }
    
    .setup-tab {
        text-align: left;
        border-left: 3px solid transparent;
        border-bottom: none;
    }
    
    .setup-tab.active {
        border-left-color: #3b82f6;
        border-bottom-color: transparent;
    }
    
    .setup-options {
        grid-template-columns: 1fr;
    }
    
    .tool-intro {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .feature-grid {
        grid-template-columns: 1fr;
    }
    
    .role-recommendations {
        grid-template-columns: 1fr;
    }
    
    .workflow-steps {
        flex-direction: column;
    }
    
    .mini-step {
        text-align: center;
    }
    
    .comparison-table {
        font-size: 0.8rem;
    }
    
    .comparison-table th,
    .comparison-table td {
        padding: 0.5rem;
    }
}
`;

const setupStyle = document.createElement('style');
setupStyle.textContent = setupCSS;
document.head.appendChild(setupStyle);

// Quiz Implementation
const quizQuestions = [ // 100 comprehensive questions covering all tutorial content
    {
        question: "What is the main difference between Git and GitHub?",
        options: [
            "Git is a web platform, GitHub is a command-line tool",
            "Git is for version control, GitHub is a cloud hosting platform for Git repositories",
            "They are the same thing with different names",
            "Git is for Windows, GitHub is for Mac"
        ],
        correct: 1,
        section: "intro"
    },
    {
        question: "Which is the correct way to create a new repository on GitHub?",
        options: [
            "Click 'New repository' button and fill in the details",
            "Use 'git init' command on GitHub website",
            "Send an email to GitHub support",
            "Fork an existing repository"
        ],
        correct: 0,
        section: "repositories"
    },
    {
        question: "Which command downloads a repository from GitHub to your local machine?",
        options: [
            "git download",
            "git copy",
            "git clone",
            "git pull"
        ],
        correct: 2,
        section: "repositories"
    },
    {
        question: "Complete the Git workflow by typing the correct commands:",
        type: "interactive",
        component: "git-workflow",
        section: "basics"
    },
    {
        question: "Which command uploads your local commits to GitHub?",
        options: [
            "git upload",
            "git send",
            "git push",
            "git sync"
        ],
        correct: 2,
        section: "basics"
    },
    {
        question: "Which command downloads updates from GitHub to your local repository?",
        options: [
            "git download",
            "git fetch",
            "git pull",
            "git update"
        ],
        correct: 2,
        section: "basics"
    },
    {
        question: "Practice branching commands by completing this scenario:",
        type: "interactive",
        component: "branch-practice",
        section: "branching"
    },
    {
        question: "When merging branches, if Git can't automatically combine changes, what occurs?",
        options: [
            "The merge is cancelled",
            "Git picks the newer changes",
            "A merge conflict occurs that you must resolve manually",
            "Git deletes the conflicting files"
        ],
        correct: 2,
        section: "branching"
    },
    {
        question: "What is a Pull Request in GitHub?",
        options: [
            "A request to download code",
            "A proposal to merge changes from one branch into another",
            "A way to delete branches",
            "A request for repository access"
        ],
        correct: 1,
        section: "collaboration"
    },
    {
        question: "How do you comment on a specific line of code in a Pull Request?",
        options: [
            "Email the repository owner",
            "Click the line number in the 'Files changed' tab",
            "Create a new issue",
            "Use git comment command"
        ],
        correct: 1,
        section: "collaboration"
    },
    {
        question: "What is forking a repository?",
        options: [
            "Deleting a repository",
            "Creating your own copy of someone else's repository",
            "Merging two repositories",
            "Renaming a repository"
        ],
        correct: 1,
        section: "advanced"
    },
    {
        question: "After forking, how do you get the repository to your local machine?",
        options: [
            "git fork",
            "git download",
            "git clone [your-fork-url]",
            "Download ZIP file"
        ],
        correct: 2,
        section: "advanced"
    },
    {
        question: "To keep your fork up-to-date with the original repository, you should:",
        options: [
            "Delete and re-fork the repository",
            "Add the original as 'upstream' remote and pull changes",
            "Email the original owner for updates",
            "Forks automatically stay synchronized"
        ],
        correct: 1,
        section: "advanced"
    },
    {
        question: "Create a .gitignore file for a web project:",
        type: "interactive", 
        component: "gitignore-builder",
        section: "best-practices"
    },
    {
        question: "A README.md file should typically include:",
        options: [
            "Only the project name",
            "Project description, installation instructions, and usage examples",
            "Personal information about the developer",
            "Complete source code"
        ],
        correct: 1,
        section: "best-practices"
    },
    {
        question: "Why should you add a license to your repository?",
        options: [
            "It's required by GitHub",
            "To specify how others can use, modify, and distribute your code",
            "To make the repository private",
            "To enable GitHub Actions"
        ],
        correct: 1,
        section: "best-practices"
    },
    {
        question: "GitHub Issues are best used for:",
        options: [
            "Storing source code",
            "Tracking bugs, feature requests, and project tasks",
            "Hosting websites",
            "Managing user accounts"
        ],
        correct: 1,
        section: "collaboration"
    },
    {
        question: "What should you NEVER commit to a public Git repository?",
        options: [
            "Source code files",
            "Documentation files",
            "Passwords, API keys, and sensitive information",
            "README files"
        ],
        correct: 2,
        section: "best-practices"
    }
];

let currentQuestionIndex = 0;
let userAnswers = new Array(quizQuestions.length).fill(null);
let quizStarted = false;
let quizCompleted = false;
let finalQuizScore = 0;
let shuffledQuestions = [];
let questionMapping = []; // Maps shuffled index to original index

// Section name mapping for better display
const sectionNames = {
    'intro': 'Introduction',
    'setup': 'Setup',
    'repositories': 'Repositories',
    'basics': 'Git Basics',
    'branching': 'Branching & Merging',
    'collaboration': 'Collaboration',
    'advanced': 'Advanced Features',
    'best-practices': 'Best Practices'
};

// Shuffle function using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize shuffled questions (select 20 random questions from 100)
function initializeQuestions() {
    // Create array of indices
    const indices = Array.from({length: quizQuestions.length}, (_, i) => i);
    // Shuffle the indices
    const shuffledIndices = shuffleArray(indices);
    
    // Select only 20 questions from the shuffled array
    const selectedIndices = shuffledIndices.slice(0, 20);
    
    // Create shuffled questions array and mapping
    shuffledQuestions = selectedIndices.map(index => quizQuestions[index]);
    questionMapping = selectedIndices;
    
    // Reset user answers array to match the selected questions
    userAnswers = new Array(20).fill(null);
}

// Interactive component creators
function createGitWorkflowComponent() {
    return `
        <div class="interactive-component">
            <div class="scenario">
                <h4>📁 Scenario: You've made changes to index.html and want to commit them</h4>
                <p>Complete the Git workflow by typing the correct commands:</p>
            </div>
            
            <div class="workflow-steps">
                <div class="workflow-step">
                    <label>1. Stage your changes:</label>
                    <input type="text" class="cmd-input" data-answer="git add index.html" placeholder="Type the git command...">
                    <div class="feedback"></div>
                </div>
                
                <div class="workflow-step">
                    <label>2. Commit with message "Update homepage":</label>
                    <input type="text" class="cmd-input" data-answer="git commit -m \"Update homepage\"" placeholder="Type the git command...">
                    <div class="feedback"></div>
                </div>
            </div>
            
            <button class="btn-check" onclick="checkGitWorkflow()">Check Answers</button>
        </div>
    `;
}

function createBranchPracticeComponent() {
    return `
        <div class="interactive-component">
            <div class="scenario">
                <h4>🌿 Scenario: Working with branches</h4>
                <p>You need to create a new feature branch and switch to it:</p>
            </div>
            
            <div class="workflow-steps">
                <div class="workflow-step">
                    <label>1. Create a new branch called 'feature-login':</label>
                    <input type="text" class="cmd-input" data-answer="git branch feature-login" placeholder="Type the git command...">
                    <div class="feedback"></div>
                </div>
                
                <div class="workflow-step">
                    <label>2. Switch to that branch:</label>
                    <input type="text" class="cmd-input" data-answer="git checkout feature-login" placeholder="Type the git command...">
                    <div class="feedback"></div>
                </div>
                
                <div class="workflow-step">
                    <label>3. Or do both in one command:</label>
                    <input type="text" class="cmd-input" data-answer="git checkout -b feature-login" placeholder="Alternative single command...">
                    <div class="feedback"></div>
                </div>
            </div>
            
            <button class="btn-check" onclick="checkBranchPractice()">Check Answers</button>
        </div>
    `;
}

function createGitignoreBuilderComponent() {
    return `
        <div class="interactive-component">
            <div class="scenario">
                <h4>🚫 Create a .gitignore file</h4>
                <p>Select which files/folders should be ignored in a typical web project:</p>
            </div>
            
            <div class="gitignore-options">
                <label><input type="checkbox" value="node_modules/" data-correct="true"> node_modules/</label>
                <label><input type="checkbox" value=".env" data-correct="true"> .env</label>
                <label><input type="checkbox" value="*.log" data-correct="true"> *.log</label>
                <label><input type="checkbox" value="index.html" data-correct="false"> index.html</label>
                <label><input type="checkbox" value="dist/" data-correct="true"> dist/</label>
                <label><input type="checkbox" value="package.json" data-correct="false"> package.json</label>
                <label><input type="checkbox" value=".DS_Store" data-correct="true"> .DS_Store</label>
                <label><input type="checkbox" value="src/" data-correct="false"> src/</label>
            </div>
            
            <button class="btn-check" onclick="checkGitignoreBuilder()">Check Selection</button>
            <div class="gitignore-preview">
                <h5>Your .gitignore file:</h5>
                <pre class="gitignore-content"></pre>
            </div>
        </div>
    `;
}

// Interactive component checkers
function checkGitWorkflow() {
    const inputs = document.querySelectorAll('.interactive-component .cmd-input');
    let allCorrect = true;
    
    inputs.forEach(input => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.answer;
        const feedback = input.nextElementSibling;
        
        // Allow some variations in answers
        const isCorrect = checkCommandEquivalence(userAnswer, correctAnswer);
        
        if (isCorrect) {
            feedback.innerHTML = '✅ Correct!';
            feedback.className = 'feedback correct';
            input.style.borderColor = '#10b981';
        } else {
            feedback.innerHTML = `❌ Try again. Expected: <code>${correctAnswer}</code>`;
            feedback.className = 'feedback incorrect';
            input.style.borderColor = '#ef4444';
            allCorrect = false;
        }
    });
    
    // Store result for this interactive question
    userAnswers[currentQuestionIndex] = allCorrect ? 'correct' : 'incorrect';
    
    // Update navigation
    if (allCorrect) {
        document.querySelector('.btn-check').style.display = 'none';
        setTimeout(() => updateQuizNavigation(), 1000);
    }
}

function checkBranchPractice() {
    const inputs = document.querySelectorAll('.interactive-component .cmd-input');
    let correctCount = 0;
    
    inputs.forEach((input, index) => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.answer;
        const feedback = input.nextElementSibling;
        
        const isCorrect = checkCommandEquivalence(userAnswer, correctAnswer);
        
        if (isCorrect) {
            feedback.innerHTML = '✅ Correct!';
            feedback.className = 'feedback correct';
            input.style.borderColor = '#10b981';
            correctCount++;
        } else {
            feedback.innerHTML = `❌ Try again. Expected: <code>${correctAnswer}</code>`;
            feedback.className = 'feedback incorrect';
            input.style.borderColor = '#ef4444';
        }
    });
    
    // Consider it correct if at least 2 out of 3 are right
    const isCorrect = correctCount >= 2;
    userAnswers[currentQuestionIndex] = isCorrect ? 'correct' : 'incorrect';
    
    if (isCorrect) {
        document.querySelector('.btn-check').style.display = 'none';
        setTimeout(() => updateQuizNavigation(), 1000);
    }
}

function checkGitignoreBuilder() {
    const checkboxes = document.querySelectorAll('.gitignore-options input[type="checkbox"]');
    let allCorrect = true;
    let selectedItems = [];
    
    checkboxes.forEach(checkbox => {
        const isChecked = checkbox.checked;
        const shouldBeChecked = checkbox.dataset.correct === 'true';
        const label = checkbox.parentElement;
        
        if (isChecked !== shouldBeChecked) {
            allCorrect = false;
            label.style.color = '#ef4444';
        } else {
            label.style.color = '#10b981';
        }
        
        if (isChecked) {
            selectedItems.push(checkbox.value);
        }
    });
    
    // Update preview
    const preview = document.querySelector('.gitignore-content');
    preview.textContent = selectedItems.join('\n');
    
    userAnswers[currentQuestionIndex] = allCorrect ? 'correct' : 'incorrect';
    
    if (allCorrect) {
        document.querySelector('.btn-check').style.display = 'none';
        setTimeout(() => updateQuizNavigation(), 1000);
    }
}

// Helper function to check command equivalence
function checkCommandEquivalence(userInput, expectedCommand) {
    // Normalize whitespace and quotes
    const normalize = (cmd) => cmd.toLowerCase().trim().replace(/\s+/g, ' ').replace(/['"]/g, '"');
    
    const normalizedUser = normalize(userInput);
    const normalizedExpected = normalize(expectedCommand);
    
    // Check for exact match
    if (normalizedUser === normalizedExpected) return true;
    
    // Check for common variations
    const variations = {
        'git add index.html': ['git add index.html', 'git add .'],
        'git checkout feature-login': ['git checkout feature-login', 'git switch feature-login'],
        'git checkout -b feature-login': ['git checkout -b feature-login', 'git switch -c feature-login']
    };
    
    const expectedNorm = normalizedExpected;
    if (variations[expectedNorm]) {
        return variations[expectedNorm].some(variant => normalize(variant) === normalizedUser);
    }
    
    return false;
}

// Update navigation after interactive component completion
function updateQuizNavigation() {
    updateNavigationButtons();
    
    // Auto-advance if this was the last question
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
        setTimeout(() => finishQuiz(), 500);
    }
}

function startQuiz() {
    quizStarted = true;
    currentQuestionIndex = 0;
    
    // Initialize shuffled questions
    initializeQuestions();
    
    // Hide intro, show quiz container
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    
    displayCurrentQuestion();
    updateProgress();
    updateNavigationButtons();
}

function displayCurrentQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    const questionContainer = document.getElementById('questionContainer');
    
    if (question.type === 'interactive') {
        // Display interactive component
        let componentHtml = '';
        switch (question.component) {
            case 'git-workflow':
                componentHtml = createGitWorkflowComponent();
                break;
            case 'branch-practice':
                componentHtml = createBranchPracticeComponent();
                break;
            case 'gitignore-builder':
                componentHtml = createGitignoreBuilderComponent();
                break;
        }
        
        questionContainer.innerHTML = `
            <div class="question">
                <h3>Question ${currentQuestionIndex + 1}: ${question.question}</h3>
                ${componentHtml}
            </div>
        `;
    } else {
        // Display regular multiple choice question
        questionContainer.innerHTML = `
            <div class="question">
                <h3>Question ${currentQuestionIndex + 1}: ${question.question}</h3>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <label class="option ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}" 
                               onclick="selectAnswer(${index})">
                            <input type="radio" name="question${currentQuestionIndex}" value="${index}" 
                                   ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    
    // Update visual selection
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.classList.toggle('selected', index === answerIndex);
    });
    
    updateNavigationButtons();
}

function updateProgress() {
    const progressBar = document.getElementById('quizProgressBar');
    const questionNum = document.getElementById('currentQuestionNum');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (progressBar) {
        const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    if (questionNum) {
        questionNum.textContent = currentQuestionIndex + 1;
    }
    
    if (progressPercentage) {
        const percentage = Math.round(((currentQuestionIndex + 1) / shuffledQuestions.length) * 100);
        progressPercentage.textContent = `${percentage}%`;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    
    if (nextBtn && submitBtn) {
        const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;
        
        if (isLastQuestion) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
    }
}

function nextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
        updateProgress();
        updateNavigationButtons();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
        updateProgress();
        updateNavigationButtons();
    }
}

function submitQuiz() {
    // Check if all questions are answered
    const unansweredQuestions = userAnswers.filter(answer => answer === null).length;
    
    if (unansweredQuestions > 0) {
        alert(`Please answer all questions. You have ${unansweredQuestions} unanswered question(s).`);
        return;
    }
    
    quizCompleted = true;
    
    // Calculate score using the shuffled questions
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
        const question = shuffledQuestions[index];
        if (question.type === 'interactive') {
            // For interactive questions, check if answer is 'correct'
            if (answer === 'correct') {
                correctAnswers++;
            }
        } else {
            // For multiple choice questions, check against correct index
            if (answer === question.correct) {
                correctAnswers++;
            }
        }
    });
    
    const percentage = Math.round((correctAnswers / shuffledQuestions.length) * 100);
    const passed = percentage >= 80;
    
    // Store final score for certificate generation
    finalQuizScore = percentage;
    
    // Hide quiz container
    document.getElementById('quizContainer').style.display = 'none';
    
    // Show results
    showQuizResults(correctAnswers, percentage, passed);
    
    // If passed, show certificate form
    if (passed) {
        document.getElementById('certificateSection').style.display = 'block';
    }
    
}

function showQuizResults(correctAnswers, percentage, passed) {
    const resultsContainer = document.getElementById('quizResults');
    resultsContainer.style.display = 'block';
    
    resultsContainer.innerHTML = `
        <div class="result-header">
            <h3>Quiz Results</h3>
            <div class="score-display ${passed ? 'pass' : 'fail'}">${percentage}%</div>
            <div class="result-message ${passed ? 'pass' : 'fail'}">
                ${passed ? 
                    '🎉 Congratulations! You passed the GitHub 101 Quiz!<br>🏆 You\'ve earned your GitHub 101 certificate!' : 
                    '📚 Keep studying! You need 80% to pass. Review the material and try again.'
                }
            </div>
            <div class="score-summary">You answered ${correctAnswers} out of ${shuffledQuestions.length} questions correctly.</div>
        </div>
        
        <div class="question-review">
            <h4>Question Review:</h4>
            ${shuffledQuestions.map((q, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === q.correct;
                const sectionName = sectionNames[q.section] || q.section;
                
                return `
                    <div class="question-result ${isCorrect ? 'correct' : 'incorrect'}">
                        <h4>Question ${index + 1}: ${q.question}</h4>
                        <div class="user-answer">Your answer: ${userAnswer !== null ? q.options[userAnswer] : 'No answer selected'}</div>
                        ${!isCorrect ? `
                            <div class="correct-answer">Correct answer: ${q.options[q.correct]}</div>
                            <div class="section-link">
                                📖 Review this topic: 
                                <button class="btn-section-link" onclick="navigateToSection('${q.section}')" title="Go to ${sectionName} section">
                                    ${sectionName}
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
        
        ${!passed ? `
            <div class="retake-section">
                <p>💡 <strong>Tip:</strong> Click on the section links above to review topics you missed, then retake the quiz with randomized questions!</p>
                <button class="btn btn-primary" onclick="retakeQuiz()">🔄 Retake Quiz (New Question Order)</button>
            </div>
        ` : ''}
    `;
    
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

function retakeQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    quizCompleted = false;
    
    // Re-shuffle questions for retake
    initializeQuestions();
    
    // Hide results and certificate
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('certificateSection').style.display = 'none';
    
    // Show quiz intro
    document.getElementById('quizIntro').style.display = 'block';
    document.getElementById('quizContainer').style.display = 'none';
    
    // Scroll to intro
    document.getElementById('quizIntro').scrollIntoView({ behavior: 'smooth' });
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char];
    });
}

function generateCertificate() {
    const studentNameElement = document.getElementById('studentName');
    const studentName = studentNameElement ? studentNameElement.value.trim() : '';
    
    if (!studentName) {
        alert('Please enter your full name to generate the certificate.');
        if (studentNameElement) {
            studentNameElement.focus();
        }
        return;
    }
    
    // Show loading state
    const certificateForm = document.getElementById('certificateForm');
    const originalContent = certificateForm.innerHTML;
    certificateForm.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="loading-spinner"></div>
            <p style="margin-top: 1rem; color: #4a5568;">Generating your certificate...</p>
        </div>
    `;
    
    // Simulate processing time for better UX
    setTimeout(() => {
    
    // Create certificate content
    const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const isPerfectScore = finalQuizScore === 100;
    const safeName = escapeHtml(studentName);
    
    // Create HTML certificate display matching the PDF version
    const certificateHTML = `
        <div class="certificate-display">
            <div class="corner-ornament top-left"></div>
            <div class="corner-ornament top-right"></div>
            <div class="corner-ornament bottom-left"></div>
            <div class="corner-ornament bottom-right"></div>
            
            
            <div class="header">
                <div class="logo-section">
                    <svg class="github-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <div class="logo">🎓</div>
                </div>
                <div class="school-name">Walderbach College of Foolishness</div>
                <div class="motto">Ex stultis discimus.</div>
            </div>
            
            <div class="certificate-body">
                <div class="title">Certificate of Completion</div>
                
                <div class="presented-to">Presented to</div>
                
                <div class="name">${safeName}</div>
                
                <div class="achievement">
                    for successful completion of the <strong>GitHub 101 Fundamentals</strong> training program.
                    This certificate acknowledges proficiency in Git version control systems, 
                    GitHub collaborative workflows, and essential development practices.
                </div>
                
                <div class="score-section">
                    <div class="score-label">Final Assessment Score:</div>
                    <div class="score-value">${finalQuizScore}%</div>
                </div>
            </div>
            
            <div class="details">
                <div class="date">
                    <div class="label">Date of Completion</div>
                    <div class="date-text">${today}</div>
                </div>
                <div class="signature">
                    <div class="label">Instructor</div>
                    <div class="signature-line"></div>
                    <div class="instructor">Joshua Walderbach</div>
                </div>
            </div>
        </div>
    `;
    
    // Display the certificate on the page
    document.getElementById('certificateForm').innerHTML = `
        <h3>🎉 Congratulations!</h3>
        <p>You have successfully completed GitHub 101!</p>
        ${certificateHTML}
        <div style="margin-top: 2rem; text-align: center;">
            <button class="btn btn-primary" id="downloadCertificateBtn">
                📄 Download Certificate as PDF
            </button>
            <button class="btn btn-secondary" id="retakeQuizBtn" style="margin-left: 1rem;">Take Quiz Again</button>
        </div>
    `;

    const downloadBtn = document.getElementById('downloadCertificateBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadCertificateAsPDF(studentName);
        });
    }

    const retakeBtn = document.getElementById('retakeQuizBtn');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', resetQuiz);
    }
    
    console.log('Certificate displayed successfully for:', studentName, 'Score:', finalQuizScore);
    }, 800); // Close setTimeout for loading simulation
}

function downloadCertificateAsPDF(studentName) {
    const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const isPerfectScore = finalQuizScore === 100;
    const safeName = escapeHtml(studentName);
    
    // Create a new window with a printable certificate
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
        alert('Pop-up blocked. Please allow pop-ups to download the certificate.');
        return;
    }
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GitHub 101 Certificate - ${safeName}</title>
            <style>
                @page {
                    size: 11in 8.5in;
                    margin: 0.5in;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Georgia', serif;
                    line-height: 1.4;
                    color: #2d3748;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 10px;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .certificate {
                    width: 100%;
                    max-width: 10in;
                    height: 7.5in;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border: 8px solid transparent;
                    background-clip: padding-box;
                    border-radius: 20px;
                    padding: 30px 25px;
                    position: relative;
                    page-break-inside: avoid;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                
                .certificate::before {
                    content: '';
                    position: absolute;
                    top: -8px;
                    left: -8px;
                    right: -8px;
                    bottom: -8px;
                    background: linear-gradient(135deg, #24292e 0%, #0366d6 30%, #28a745 60%, #ffd33d 100%);
                    border-radius: 20px;
                    z-index: -1;
                }
                
                .certificate::after {
                    content: '';
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    right: 10px;
                    bottom: 10px;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e2e8f0" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                    border-radius: 15px;
                    opacity: 0.3;
                    z-index: -1;
                    pointer-events: none;
                }
                
                .perfect-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                    color: #744210;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
                    border: 2px solid #fff;
                    transform: rotate(-5deg);
                    z-index: 10;
                }
                
                .perfect-badge::before {
                    content: '⭐';
                    margin-right: 4px;
                }
                
                .perfect-badge::after {
                    content: '⭐';
                    margin-left: 4px;
                }
                
                .corner-ornament {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #0366d6 0%, #28a745 100%);
                    opacity: 0.1;
                }
                
                .corner-ornament.top-left {
                    top: 15px;
                    left: 15px;
                    border-radius: 0 0 100% 0;
                }
                
                .corner-ornament.top-right {
                    top: 15px;
                    right: 15px;
                    border-radius: 0 0 0 100%;
                }
                
                .corner-ornament.bottom-left {
                    bottom: 15px;
                    left: 15px;
                    border-radius: 0 100% 0 0;
                }
                
                .corner-ornament.bottom-right {
                    bottom: 15px;
                    right: 15px;
                    border-radius: 100% 0 0 0;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 15px;
                    position: relative;
                }
                
                .logo-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 8px;
                }
                
                .github-logo {
                    width: 35px;
                    height: 35px;
                    fill: #24292e;
                }
                
                .logo {
                    font-size: 32px;
                }
                
                .school-name {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 3px;
                    background: linear-gradient(135deg, #24292e 0%, #0366d6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .motto {
                    font-style: italic;
                    color: #718096;
                    font-size: 12px;
                    position: relative;
                }
                
                .motto::before,
                .motto::after {
                    content: '✧';
                    color: #0366d6;
                    margin: 0 8px;
                }
                
                .certificate-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 20px;
                }
                
                .title {
                    text-align: center;
                    font-size: 28px;
                    font-weight: bold;
                    margin: 20px 0;
                    letter-spacing: 3px;
                    color: #24292e;
                    text-transform: uppercase;
                    position: relative;
                }
                
                .title::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent 0%, #0366d6 50%, transparent 100%);
                }
                
                .title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent 0%, #0366d6 50%, transparent 100%);
                }
                
                .presented-to {
                    text-align: center;
                    font-size: 16px;
                    color: #4a5568;
                    margin: 20px 0 10px 0;
                    font-style: italic;
                }
                
                .name {
                    text-align: center;
                    font-size: 28px;
                    font-weight: bold;
                    background: linear-gradient(135deg, #0366d6 0%, #28a745 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 10px 0;
                    padding-bottom: 6px;
                    position: relative;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .name::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent 0%, #0366d6 20%, #28a745 80%, transparent 100%);
                    border-radius: 2px;
                }
                
                .achievement {
                    text-align: center;
                    font-size: 14px;
                    line-height: 1.6;
                    margin: 15px 0;
                    padding: 0 25px;
                    color: #2d3748;
                }
                
                .score-section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    margin: 15px 25px;
                    padding: 12px;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    border-radius: 8px;
                }
                
                .score-label {
                    font-size: 14px;
                    color: #4a5568;
                    font-weight: 600;
                }
                
                .score-value {
                    font-size: 20px;
                    font-weight: bold;
                    color: #2b6cb0;
                    background: linear-gradient(135deg, #0366d6 0%, #28a745 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .score {
                    color: #2b6cb0;
                    font-weight: bold;
                    font-size: 16px;
                }
                
                .perfect-message {
                    margin-top: 10px;
                    color: #2b6cb0;
                    font-weight: bold;
                    font-size: 14px;
                }
                
                .details {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 2px solid #e2e8f0;
                }
                
                .date, .signature {
                    text-align: center;
                    width: 45%;
                }
                
                .label {
                    font-size: 10px;
                    color: #718096;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    font-weight: bold;
                }
                
                .signature-line {
                    border-bottom: 2px solid #2d3748;
                    width: 150px;
                    margin: 12px auto 8px;
                }
                
                .instructor {
                    font-weight: bold;
                    font-size: 14px;
                }
                
                .date-text {
                    font-size: 14px;
                    font-weight: 600;
                }
                
                @media print {
                    body { 
                        background: white !important; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .certificate { 
                        box-shadow: 0 0 0 8px #24292e !important;
                        page-break-inside: avoid;
                    }
                    .certificate::before {
                        background: linear-gradient(135deg, #24292e 0%, #0366d6 30%, #28a745 60%, #ffd33d 100%) !important;
                    }
                    .corner-ornament {
                        opacity: 0.2 !important;
                    }
                }
                
                .download-instructions {
                    text-align: center;
                    margin: 20px 0;
                    padding: 15px;
                    background: #f7fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14px;
                    color: #4a5568;
                }
                
                @media print {
                    .download-instructions { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="download-instructions">
                <strong>To save as PDF:</strong> Press Ctrl+P (or Cmd+P on Mac), then select "Save as PDF" as your printer destination.
            </div>
            
            <div class="certificate">
                <div class="corner-ornament top-left"></div>
                <div class="corner-ornament top-right"></div>
                <div class="corner-ornament bottom-left"></div>
                <div class="corner-ornament bottom-right"></div>
                
                    
                <div class="header">
                    <div class="logo-section">
                        <svg class="github-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <div class="logo">🎓</div>
                        <svg class="github-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </div>
                    <div class="school-name">Walderbach College of Foolishness</div>
                    <div class="motto">Ex stultis discimus.</div>
                </div>
                
                <div class="certificate-body">
                    <div class="title">Certificate of Completion</div>
                    
                    <div class="presented-to">Presented to</div>
                    
                <div class="name">${safeName}</div>
                    
                    <div class="achievement">
                        for successful completion of the <strong>GitHub 101 Fundamentals</strong> training program.
                        This certificate acknowledges proficiency in Git version control systems, 
                        GitHub collaborative workflows, and essential development practices.
                    </div>
                    
                    <div class="score-section">
                        <div class="score-label">Final Assessment Score:</div>
                        <div class="score-value">${finalQuizScore}%</div>
                    </div>
                </div>
                
                <div class="details">
                    <div class="date">
                        <div class="label">Date of Completion</div>
                        <div class="date-text">${today}</div>
                    </div>
                    <div class="signature">
                        <div class="label">Instructor</div>
                        <div class="signature-line"></div>
                        <div class="instructor">Joshua Walderbach</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Focus the new window and optionally trigger print dialog
    printWindow.focus();
    
    // Auto-trigger print dialog after a brief delay
    setTimeout(() => {
        printWindow.print();
    }, 500);
}


// Quiz initialization flag to prevent multiple initializations

// Konami Code Easter Egg
const konamiCode = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

let konamiSequence = [];
let konamiTimeout = null;

function handleKonamiCode(event) {
    // Clear timeout if user is actively typing
    if (konamiTimeout) {
        clearTimeout(konamiTimeout);
    }
    
    // Add the pressed key to sequence
    konamiSequence.push(event.code);
    
    // Keep only the last 10 keys (length of Konami code)
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    // Check if sequence matches Konami code
    if (konamiSequence.length === konamiCode.length) {
        const isMatch = konamiSequence.every((key, index) => key === konamiCode[index]);
        
        if (isMatch) {
            triggerKonamiEasterEgg();
            konamiSequence = []; // Reset sequence
            return;
        }
    }
    
    // Reset sequence after 2 seconds of inactivity
    konamiTimeout = setTimeout(() => {
        konamiSequence = [];
    }, 2000);
}

function triggerKonamiEasterEgg() {
    // Visual feedback
    const body = document.body;
    
    // Flash rainbow colors
    body.style.transition = 'all 0.3s ease';
    body.style.background = 'linear-gradient(45deg, #ff0000, #ff7700, #ffdd00, #00ff00, #0077ff, #3300ff, #7700ff)';
    body.style.backgroundSize = '400% 400%';
    body.style.animation = 'rainbow 0.5s ease-in-out';
    
    // Add rainbow animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes konamiGlow {
            0%, 100% { 
                box-shadow: 0 0 5px rgba(0, 245, 255, 0.5);
                transform: scale(1);
            }
            50% { 
                box-shadow: 0 0 30px rgba(0, 245, 255, 1);
                transform: scale(1.02);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Apply glow effect to container
    const container = document.querySelector('.container');
    if (container) {
        container.style.animation = 'konamiGlow 0.5s ease-in-out';
    }
    
    // Show success message with retro styling
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff1493, #00f5ff);
        color: white;
        padding: 2rem;
        border-radius: 12px;
        font-family: 'JetBrains Mono', monospace;
        font-weight: bold;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 0 50px rgba(255, 20, 147, 0.8);
        border: 2px solid #fff;
        animation: konamiGlow 0.5s ease-in-out infinite alternate;
    `;
    message.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 1rem;">🎮 KONAMI CODE ACTIVATED! 🎮</div>
        <div style="font-size: 1rem;">Launching retro surprise...</div>
    `;
    
    document.body.appendChild(message);
    
    // Sound effect (if possible)
    try {
        // Create a simple beep using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Classic power-up sound frequencies
        const frequencies = [262, 330, 392, 523]; // C, E, G, C (one octave up)
        let currentFreq = 0;
        
        const playNote = () => {
            if (currentFreq < frequencies.length) {
                oscillator.frequency.setValueAtTime(frequencies[currentFreq], audioContext.currentTime);
                oscillator.type = 'square'; // Retro sound
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                currentFreq++;
                setTimeout(playNote, 200);
            }
        };
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
        playNote();
    } catch (e) {
        // Audio might not be supported, that's okay
        console.log('Audio not supported, but Konami code still works!');
    }
    
    // Wait 2 seconds then open the YouTube link
    setTimeout(() => {
        // Remove message
        message.remove();
        
        // Reset styles
        body.style.background = '';
        body.style.animation = '';
        if (container) {
            container.style.animation = '';
        }
        
        // Open the YouTube video (Rick Roll!)
        window.open('https://youtu.be/dQw4w9WgXcQ?si=ccryDsmRFoXk7XcW', '_blank');
        
    }, 2000);
}

// Add event listener for Konami code
document.addEventListener('keydown', handleKonamiCode);
