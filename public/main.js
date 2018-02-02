const form = document.getElementById('vote-form');

// Form submit event
form.addEventListener('submit', (e) => {
    const choice = document.querySelector('input[name=party]:checked').value;
    // Data sent along with post req.
    const data = {party: choice};

    // Send post req.
    fetch('http://localhost:3000/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
    e.preventDefault();
});

let dataPoints = [
    { label: 'Democrat', y: 0 },
    { label: 'Republican', y: 0 },
    { label: 'Independent', y: 0 },
    { label: 'Green Party', y: 0 },
    { label: 'Libertarian', y: 0 },
    { label: 'Other', y: 0 }
];

const chartContainer = document.querySelector
('#chartContainer');

if(chartContainer) {
    const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        title: {
            text: 'Results'
        },
        data: [
            {
                type: 'column',
                dataPoints: dataPoints
            }
        ]
    });
    chart.render();

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    let pusher = new Pusher('c12fbde6601da0630621', {
        cluster: 'us2',
        encrypted: true
    });

    let channel = pusher.subscribe('poll');
    channel.bind('vote', function (data) {
        // Add data to chart
        dataPoints = dataPoints.map(x => {
            if(x.label == data.party) {
                x.y += data.points;
                return x;
            } else { 
                return x;
            }
        });
        chart.render();
    });
}