(function () {
  var el = document.getElementById('chart-issues');
  if (!el || typeof echarts === 'undefined') return;

  var chart = echarts.init(el);
  var cats = ['合规冲突', '内容红线违规', '引用失效', '文档矛盾', '数字不一致', '文档脱节', '工程问题', '体系缺失', '口径残留', '细节/表述'];
  var high = [2, 1, 1, 2, 0, 0, 0, 0, 0, 0];
  var medium = [0, 0, 1, 0, 1, 1, 3, 2, 2, 0];
  var low = [0, 0, 0, 0, 0, 0, 0, 0, 0, 7];

  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['高', '中', '低'], top: 0 },
    grid: { left: 60, right: 24, top: 44, bottom: 30 },
    xAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: '#e1e6ec' } },
      axisLabel: { color: '#5c6b7a' }
    },
    yAxis: {
      type: 'category',
      data: cats,
      axisLabel: { color: '#1c2433' },
      axisLine: { lineStyle: { color: '#e1e6ec' } }
    },
    series: [
      { name: '高', type: 'bar', stack: 'total', data: high, itemStyle: { color: '#c0392b' }, barWidth: 18 },
      { name: '中', type: 'bar', stack: 'total', data: medium, itemStyle: { color: '#d68910' } },
      { name: '低', type: 'bar', stack: 'total', data: low, itemStyle: { color: '#2e86ab' } }
    ]
  });

  window.addEventListener('resize', function () { chart.resize(); });
})();
