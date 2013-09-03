
// LIVE SPLINE CHART
$(function () {
    $(document).ready(function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        var livechart;
        $('#livechart').highcharts({
            chart: {
                width:500,
                height:300,
                type: 'spline',
                backgroundColor:'rgba(255, 255, 255, 0)',
                Color:'white',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function() {


                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);

                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live Hana Customers',
                style: {
                    color: 'white'

                }
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                labels: {

                    style: {
                        color: 'white'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Value',
                    style: {
                        color: 'white'
                    }

                },
                labels: {

                    style: {
                        color: 'white'
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    style: {
                        color: 'white'

                    }

                }]
            },

            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                color: '#EEA926',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }]
        });
    });

});



// BAR CHART
$(function () {

    var colors = ['#EEA926','#EEA926','#EEA926','#EEA926','#EEA926'];
        categories = ['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
        name = 'SAP Apps',
        data = [{
            y: 55.11,
            color: colors[0],
            drilldown: {
                name: 'MSIE versions',
                categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0'],
                data: [10.85, 7.35, 33.06, 2.81],
                color: colors[0]
            }
        }, {
            y: 21.63,
            color: colors[1],
            drilldown: {
                name: 'Firefox versions',
                categories: ['Firefox 2.0', 'Firefox 3.0', 'Firefox 3.5', 'Firefox 3.6', 'Firefox 4.0'],
                data: [0.20, 0.83, 1.58, 13.12, 5.43],
                color: colors[1]
            }
        }, {
            y: 11.94,
            color: colors[2],
            drilldown: {
                name: 'Chrome versions',
                categories: ['Chrome 5.0', 'Chrome 6.0', 'Chrome 7.0', 'Chrome 8.0', 'Chrome 9.0',
                    'Chrome 10.0', 'Chrome 11.0', 'Chrome 12.0'],
                data: [0.12, 0.19, 0.12, 0.36, 0.32, 9.91, 0.50, 0.22],
                color: colors[2]
            }
        }, {
            y: 7.15,
            color: colors[3],
            drilldown: {
                name: 'Safari versions',
                categories: ['Safari 5.0', 'Safari 4.0', 'Safari Win 5.0', 'Safari 4.1', 'Safari/Maxthon',
                    'Safari 3.1', 'Safari 4.1'],
                data: [4.55, 1.42, 0.23, 0.21, 0.20, 0.19, 0.14],
                color: colors[3]
            }
        }, {
            y: 2.14,
            color: colors[4],
            drilldown: {
                name: 'Opera versions',
                categories: ['Opera 9.x', 'Opera 10.x', 'Opera 11.x'],
                data: [ 0.12, 0.37, 1.65],
                color: colors[4]
            }
        }];

    function setChart(name, categories, data, color) {
        chart.xAxis[0].setCategories(categories, false);
        chart.series[0].remove(false);
        chart.addSeries({
            name: name,
            data: data,
            color: color || 'white'
        }, false);
        chart.redraw();
    }

    var chart = $('#barchart').highcharts({
        chart: {
            width:500,
            height:300,
            type: 'column',
            backgroundColor:'rgba(255, 255, 255, 0)',
            Color:'white'
        },
        title: {
            text: 'Market Share Fiori',
            style: {
                color: 'white'
            }
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: categories,
            labels: {

                style: {
                    color: 'white'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Total percent market share',
                style: {
                    color: 'white'
                }

            },
            labels: {

                style: {
                    color: 'white'
                }
            }
        },
        plotOptions: {
            column: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                            var drilldown = this.drilldown;
                            if (drilldown) { // drill down
                                setChart(drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
                            } else { // restore
                                setChart(name, categories, data);
                            }
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    color: colors[0],
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function() {
                        return this.y +'%';
                    }
                }
            }
        },
        tooltip: {
            formatter: function() {
                var point = this.point,
                    s = this.x +':<b>'+ this.y +'% market share</b><br/>';
                if (point.drilldown) {
                    s += 'Click to view '+ point.category +' versions';
                } else {
                    s += 'Click to return to browser brands';
                }
                return s;
            }
        },
        series: [{
            name: name,
            data: data,
            color: 'white',
            borderWidth: 0
        }],
        exporting: {
            enabled: false
        }
    })
        .highcharts(); // return chart


});

