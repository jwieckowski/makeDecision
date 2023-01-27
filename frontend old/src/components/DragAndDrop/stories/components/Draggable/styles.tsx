interface Props {
    type: string;
}

type dict = {
    [key: string]: object
}

export default function blockStyles(type: string) {
    const method = {
        backgroundColor: '#4038EC',
        border: '3px solid #2016CA',
        height: '120px',
        width: '120px'
    }

    const criteria = {
        backgroundColor: '#19EEE4',
        border: '3px solid #07CCC2',
        height: '90px',
        width: '120px'
    }

    const alternative = {
        backgroundColor: '#DFEC38',
        border: '3px solid #BDCA16',
        height: '90px',
        width: '120px'
    }

    const weight = {
        backgroundColor: '#ECB038',
        border: '3px solid #CA9016',
        height: '90px',
        width: '120px'
    }

    const ranking = {
        backgroundColor: '#EC385B',
        border: '3px solid #CA1639',
        height: '90px',
        width: '120px'
    }

    const visualization = {
        backgroundColor: '#A838EC',
        border: '3px solid #8616CA',
        height: '90px',
        width: '120px'
    }

    const correlation = {
        backgroundColor: '#5EEC38',
        border: '3px solid #3CCA16',
        height: '90px',
        width: '120px'
    }

    const neutral = {
        backgroundColor: '#666',
        border: '3px solid #333',
        height: '90px',
        width: '90px'
    }
    
    const types: dict = {
        'method': method,
        'criteria': criteria,
        'alternative': alternative,
        'weight': weight,
        'ranking': ranking,
        'visualization': visualization,
        'correlation': correlation
    }

    return types[type] || neutral
}