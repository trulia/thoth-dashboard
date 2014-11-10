/* Lightbox functions */

// Listen for document click to close non-modal dialog
$(document).mousedown(function (e) {
  var clicked = $(e.target); // get the element clicked
  if (clicked.is('#lightbox') || clicked.is('.close-button')) {
    $('#lightbox').hide(); //or .fadeOut();
  }
  if (clicked.is('#listLightbox')) {
    $('#listLightbox').hide(); //or .fadeOut();
  }
});

/**
 * showLightBox
 * @param elem
 */

function showLightBox(elem) {
  var data = chartsData[elem.parentNode.parentNode.id].values;
  var params = chartsData[elem.parentNode.parentNode.id].options;
  if (data.length !== 0) {
    $('#lightbox').show(); // or .fadeIn();
    $('#lightboxChart h2').html(chartsData[params.chartId].options.graphTitle);
    // var chart = nv.models.lineChart()
    var chart = nv.models.lineWithFocusChart()
      .tooltipContent(function (key, y, e) {
        return  params.tooltip + '<b> ' + e + '</b><br/>' + 'Time: <b>' + y + '</b></br>';
      });
    chart.yAxis.axisLabel(chart.yLabel);
    chart.lines.scatter.xScale(d3.scale.linear());
    chart.xAxis
      .axisLabel('Timestamp')
      .tickFormat(function (d) {
        return d3.time.format("%m/%d %H:%M")(new Date(d));
      });
    chart.x2Axis
      .tickFormat(function (d) {
        return d3.time.format("%m/%d %H:%M")(new Date(d));
      });

    chart.yAxis.tickFormat(d3.format(',.2f'));
    chart.y2Axis.tickFormat(d3.format(',.2f'));

    d3.select('#lightboxChart svg')
      .datum(data)
      .call(chart);

    nv.utils.windowResize(chart.update);
  }
}

/**
 * showListLightBox
 * @param elem
 */
function showListLightBox(elem) {
  $('#listLightbox').show();
  $('#lightboxChart .timestamp').html( $('#'+elem.parentNode.parentNode.id +' .timestamp')[0].innerText);
  var qtime = $('#'+elem.parentNode.parentNode.id +' .qtime')[0];
  if (qtime != undefined){
    qtime = qtime.innerText;
    $('#lightboxChart p.qtime').html(qtime);
    $('#lightboxChart .qtime').show();
    $('#lightboxChart .query-text').show();
    $('#lightboxChart textarea.query-text').html($('#'+elem.parentNode.parentNode.id +' .query-text')[0].innerText.replace(/\&/g,"\n\n"));

  } else {
    $('#lightboxChart .exception-stackTrace').show();
    $('#lightboxChart .exception-query').show();
    $('#lightboxChart textarea.exception-query').html($('#'+elem.parentNode.parentNode.id +' .query .query-text')[0].innerText.replace(/\&/g,"\n\n"));
    $('#lightboxChart textarea.exception-stackTrace').html($('#'+elem.parentNode.parentNode.id +' .query-exception .query-text')[0].innerText);

  }
}