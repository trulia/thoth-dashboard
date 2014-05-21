/* exported chartsData */
var chartsData = {
  query_time: {
    values: [],
    options: {
      'name' : 'Average Qtime',
      'tooltip' : 'Avg Qtime: ',
      'yLabel' : 'Avg QTime (ms)',
      'graphTitle': 'Avg query time — sec',
      'chartId' : 'query_time',
      'color': '#7fd5e3',
      'unit' : 'sec',
      'round' : 2
    }
  },
  query_count: {
    values: [],
    options: {
      'name' : 'Average number of queries',
      'tooltip' : 'Avg # queries: ',
      'yLabel' : 'Avg number of queries',
      'graphTitle': 'Avg number of queries',
      'chartId' : 'query_count',
      'color': '#77dba2',
      'unit' : '',
      'round' : 0
    }
  },
  query_integral: {
    values: [],
    options: {
      'name' : '∫ Query count',
      'tooltip' : '∫ Query : ',
      'yLabel' : 'Query count',
      'chartId' : 'query_integral',
      'graphTitle': '∫ Query count',
      'color': '#F4C77F',
      'unit' : '',
      'round' : 0
    }
  },
  query_on_deck: {
    values: [],
    options: {
      'name' : 'Avg queries on deck',
      'tooltip' : 'Avg queries on deck: ',
      'yLabel' : 'Avg queries on deck',
      'chartId' : 'query_on_deck',
      'graphTitle': 'Avg queries on deck',
      'color': '#F4C77F',
      'unit' : '',
      'round' : 0
    }
  },
  exception_count: {
    values: [],
    options: {
      'name' : 'Exception count',
      'tooltip' : 'Exception count: ',
      'yLabel' : 'Exceptions',
      'y2Label' : 'Total',
      'chartId' : 'exception_count',
      'graphTitle': 'Exception count',
      'color': '#F4C77F',
      'unit' : '',
      'round' : 0
    }
  },
  exception_integral: {
    values: [],
    options: {
      'name' : '∫ Exception count',
      'tooltip' : '∫ Exception : ',
      'yLabel' : 'Exception count',
      'chartId' : 'exception_integral',
      'graphTitle': '∫ Exception count',
      'color': '#F4C77F',
      'unit' : '',
      'round' : 0
    }
  },
  zeroHits_count: {
    values: [],
    options: {
      'name' : 'Zero Hits count',
      'tooltip' : 'Zero hits count: ',
      'yLabel' : 'Zero Hits',
      'y2Label' : 'Total',
      'chartId' : 'zeroHits_count',
      'graphTitle': 'Zero Hits count',
      'color': '#F4C77F',
      'unit' : '',
      'round' : 0
    }
  },
  zeroHits_integral: {
    values: [],
    options: {
      'name' : '&#8747; Zero Hits count',
      'tooltip' : '&#8747; Zero Hits : ',
      'yLabel' : 'Zero Hits count',
      'chartId' : 'zeroHits_integral',
      'graphTitle': '&#8747; Zero Hits count',
      'color': '#F4C77F',
      'unit' : '',
      'round' : 0
    }
  },
  query_distribution: {
    values: [],
    options: {
      'name' : 'Distribution of query times',
      'tooltip' : 'Number of queries: ',
      'yLabel' : 'Number of queries',
      'chartId' : 'query_distribution',
      'graphTitle': 'Distribution of query times',
      'color': '#7fd5e3',
      'unit': '',
      'round': 0
    }
  }
};

