let chartURL = 'https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata';
let listURL = 'https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata';
let detailsURL = 'https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata';

let chartData = {};
let listData = {};
let detailsData = {};

let stockChart;
let selectedStockName;

async function fetchData(url){
    try {
        const res = await fetch(url);
        if(!res.ok){
            throw new Error('Something went wrong!!!');
        }
        const data = await res.json();
        return data;
    } catch (e) {
        alert(e);
    }
}

async function main(){
    chartData = await fetchData(chartURL);
    chartData = chartData.stocksData[0];
    listData = await fetchData(listURL);
    listData = listData.stocksStatsData[0];
    detailsData = await fetchData(detailsURL);
    detailsData = detailsData.stocksProfileData[0];

    selectedStockName = Object.keys(listData)[0]
    setDOMData.renderChart(selectedStockName, '1mo');
    document.querySelector('.timestamp-container').classList.remove('hide');
    setDOMData.renderList(listData, detailsData);
    setDOMData.renderDetails(selectedStockName);
}

const setDOMData = {
    $chartCanvaContainer: document.querySelector('#stock-chart'),
    $profileContainer : document.querySelector('.stock-profile'),
    $detailsContainer : document.querySelector('.details'),

    changeTimeStamp: function(e){
        let selectedTimeStamp = e.target.getAttribute('data-timestamp-value');
        setDOMData.renderChart(selectedStockName, selectedTimeStamp);
    },

    renderChart : function(selectedStock, timeStamp){
        // If the chart already exists, destroy it
        if (stockChart) {
            stockChart.destroy();
        }

        let currentStock = chartData[selectedStock];
        currentStock[timeStamp].value.sort((a, b) => a-b);
        currentStock[timeStamp].modifiedValue = currentStock[timeStamp].value.map((element, index, array) => {
            return Number(element).toFixed(2);
        });
        currentStock[timeStamp].timeStamp.sort((a, b) => a-b);
        currentStock[timeStamp].modifiedTimeStamp = currentStock[timeStamp].timeStamp.map((element, index, array) => {
            return new Date(element * 1000).toLocaleDateString();
        });


        const ctx = setDOMData.$chartCanvaContainer.getContext('2d');
        const labels = currentStock[timeStamp].modifiedTimeStamp;
        const dataValues = currentStock[timeStamp].modifiedValue;

        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: selectedStock,
                        data: dataValues,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0 // No fixed points visible on the line
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'nearest', // Interacts with the nearest point
                    axis: 'x', // Restrict interaction to the x-axis
                    intersect: false // Allow interaction even between points
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        callbacks: {
                            label: function(tooltipItem) {
                                // Get the value dynamically based on hover position
                                const value = tooltipItem.raw; 
                                return `Value: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        // title: {
                        //     display: true,
                        //     text: timeStamp
                        // }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price'
                        },
                        ticks: {
                            callback: function(value) {
                                return `$${value}`; // Add $ sign to Y-axis labels
                            }
                        }
                    }
                }
            }
        });
    },
    renderList : function(){
        for (let key in listData) {
            if(key === '_id'){
                continue;
            }
            const $liElem = document.createElement('li');
            const $bookValue = document.createElement('span');
            $bookValue.classList.add('stock-bookvalue');
            const $profit = document.createElement('span');
            $profit.classList.add('stock-profit', 'ft-bold');
            
            $bookValue.textContent = `$${listData[key].bookValue}`;

            let profit = Number(listData[key].profit).toFixed(2);
            if(profit > 0){
                $profit.style.color = '#008100';
            } else {
                $profit.style.color = '#ff0000';
            }
            $profit.textContent = `${profit}%`;

            $stockBtn = document.createElement('button');
            $stockBtn.setAttribute('data-stock-name',key);
            $stockBtn.classList.add('stock-name', 'ft-bold');
            $stockBtn.textContent = key;
            $liElem.append($stockBtn, $bookValue, $profit);
            setDOMData.$profileContainer.append($liElem);

            $stockBtn.addEventListener('click', (e) =>{
                const $currentBtn = e.target;
                selectedStockName = $currentBtn.getAttribute('data-stock-name');
                setDOMData.renderChart(selectedStockName, '1mo');
                setDOMData.renderDetails(selectedStockName);
            })
        }
    },
    renderDetails : function(selectedStock){
        //Set stock title
        const $stockName = setDOMData.$detailsContainer.querySelector('.stock-name');
        $stockName.textContent = selectedStock;
        const $profit = setDOMData.$detailsContainer.querySelector('.stock-profit');
        $profit.textContent = `${listData[selectedStock].profit}%`;
        if(Number(listData[selectedStock].profit) > 0){
            $profit.style.color = '#008100';
        } else {
            $profit.style.color = '#ff0000';
        }
        const $bookValue = setDOMData.$detailsContainer.querySelector('.stock-bookvalue');
        $bookValue.textContent = `$${listData[selectedStock].bookValue}`;

        //Set stock desc.
        const $stockDesc = setDOMData.$detailsContainer.querySelector('.description-item');
        $stockDesc.textContent = detailsData[selectedStock].summary;
    }
}

main();



