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

fetch('http://localhost:3000/poll')
.then(res => res.json())
.then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;
    // Count vote points for each party
    const voteCounts = votes.reduce(
        (acc, vote) => (
            (acc[vote.party] = (acc[vote.party] || 0) + parseInt(vote.points)), acc
        ),
        {}
    );

    let dataPoints = [
        { label: 'Democrat', y: voteCounts.Democrat },
        { label: 'Republican', y: voteCounts.Republican },
        { label: 'Independent', y: voteCounts.Independent },
        { label: 'Green', y: voteCounts.Green},
        { label: 'Libertarian', y: voteCounts.Libertarian },
        { label: 'Other', y: voteCounts.Other }
    ];

    const chartContainer = document.querySelector
        ('#chartContainer');

    if (chartContainer) {
        const chart = new CanvasJS.Chart('chartContainer', {
            animationEnabled: true,
            theme: 'theme1',
            title: {
                text: `Total Votes: ${totalVotes}`
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
                if (x.label == data.party) {
                    x.y += data.points;
                    return x;
                } else {
                    return x;
                }
            });
            chart.render();
        });
    }
});

