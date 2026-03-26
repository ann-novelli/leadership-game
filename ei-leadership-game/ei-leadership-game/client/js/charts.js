// Chart.js visualization for EI profiles

function createRadarChart(canvasId, scores, label) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Prepare data
    const componentLabels = [
        'Self-Awareness',
        'Self-Regulation',
        'Motivation',
        'Empathy',
        'Social Skills'
    ];
    
    const componentKeys = [
        'selfAwareness',
        'selfRegulation',
        'motivation',
        'empathy',
        'socialSkills'
    ];
    
    const data = componentKeys.map(key => scores[key] || 0);
    
    // Component colors
    const colors = {
        selfAwareness: 'rgba(74, 144, 226, 0.6)',
        selfRegulation: 'rgba(126, 211, 33, 0.6)',
        motivation: 'rgba(245, 166, 35, 0.6)',
        empathy: 'rgba(189, 16, 224, 0.6)',
        socialSkills: 'rgba(226, 74, 74, 0.6)'
    };
    
    // Create gradient or use single color
    const backgroundColor = 'rgba(52, 152, 219, 0.2)';
    const borderColor = 'rgba(52, 152, 219, 1)';
    
    // Create chart
    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: componentLabels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 2,
                pointBackgroundColor: borderColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: borderColor,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    min: Math.min(0, Math.min(...data) - 2),
                    max: Math.max(10, Math.max(...data) + 2),
                    ticks: {
                        stepSize: 2,
                        font: {
                            size: 12
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#2C3E50'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#2C3E50'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}`;
                        }
                    }
                }
            }
        }
    });
    
    // Store chart instance on canvas for later destruction
    canvas.chart = chart;
    
    return chart;
}

// Create comparison chart (optional - for comparing multiple players)
function createComparisonChart(canvasId, playersData) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    const componentLabels = [
        'Self-Awareness',
        'Self-Regulation',
        'Motivation',
        'Empathy',
        'Social Skills'
    ];
    
    const componentKeys = [
        'selfAwareness',
        'selfRegulation',
        'motivation',
        'empathy',
        'socialSkills'
    ];
    
    // Generate colors for each player
    const playerColors = [
        'rgba(74, 144, 226, 0.6)',
        'rgba(126, 211, 33, 0.6)',
        'rgba(245, 166, 35, 0.6)',
        'rgba(189, 16, 224, 0.6)',
        'rgba(226, 74, 74, 0.6)',
        'rgba(52, 152, 219, 0.6)',
        'rgba(155, 89, 182, 0.6)',
        'rgba(241, 196, 15, 0.6)'
    ];
    
    const datasets = playersData.map((player, index) => {
        const data = componentKeys.map(key => player.scores[key] || 0);
        const color = playerColors[index % playerColors.length];
        
        return {
            label: player.name,
            data: data,
            backgroundColor: color,
            borderColor: color.replace('0.6', '1'),
            borderWidth: 2,
            pointBackgroundColor: color.replace('0.6', '1'),
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6
        };
    });
    
    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: componentLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2,
                        font: {
                            size: 11
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 10,
                    cornerRadius: 6
                }
            }
        }
    });
    
    canvas.chart = chart;
    return chart;
}

// Create bar chart for component comparison
function createBarChart(canvasId, scores, groupScores) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    const componentLabels = [
        'Self-Awareness',
        'Self-Regulation',
        'Motivation',
        'Empathy',
        'Social Skills'
    ];
    
    const componentKeys = [
        'selfAwareness',
        'selfRegulation',
        'motivation',
        'empathy',
        'socialSkills'
    ];
    
    const componentColors = [
        'rgba(74, 144, 226, 0.8)',
        'rgba(126, 211, 33, 0.8)',
        'rgba(245, 166, 35, 0.8)',
        'rgba(189, 16, 224, 0.8)',
        'rgba(226, 74, 74, 0.8)'
    ];
    
    const yourData = componentKeys.map(key => scores[key] || 0);
    const groupData = componentKeys.map(key => groupScores[key] || 0);
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: componentLabels,
            datasets: [
                {
                    label: 'Your Score',
                    data: yourData,
                    backgroundColor: componentColors,
                    borderColor: componentColors.map(c => c.replace('0.8', '1')),
                    borderWidth: 2
                },
                {
                    label: 'Group Average',
                    data: groupData,
                    backgroundColor: 'rgba(149, 165, 166, 0.5)',
                    borderColor: 'rgba(149, 165, 166, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
                        }
                    }
                }
            }
        }
    });
    
    canvas.chart = chart;
    return chart;
}

// Made with Bob
