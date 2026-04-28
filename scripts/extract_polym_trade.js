const https = require('https');

const url = 'https://polym.trade/';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const apiMatches = data.match(/https?:\/\/[^\s"']*api[^\s"']*/gi) || [];
        const graphqlMatches = data.match(/graphql|\/api\/|endpoint/gi) || [];
        console.log('Potential API endpoints:');
        apiMatches.forEach(m => console.log(m));
        console.log('\nGraphQL/API references:');
        graphqlMatches.forEach(m => console.log(m));

        // Look for specific patterns
        const patterns = [
            /"api":\s*"([^"]+)"/g,
            /'api':\s*'([^']+)'/g,
            /endpoint["']?\s*:\s*["']([^"']+)["']/g,
            /graphql["']?\s*:\s*["']([^"']+)["']/g
        ];

        console.log('\nSpecific API patterns:');
        patterns.forEach(pattern => {
            const matches = data.match(pattern);
            if (matches) {
                matches.forEach(m => console.log(m));
            }
        });
    });
}).on('error', (err) => console.error('Error:', err.message));