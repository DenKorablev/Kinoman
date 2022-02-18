import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getDataStatistics, StatsType } from '../utils/statistics.js';

const FILTERS = [
  {
    type: StatsType.ALL,
    name: 'All time'
  },
  {
    type: StatsType.TODAY,
    name: 'Today'
  },
  {
    type: StatsType.WEEK,
    name: 'Week'
  },
  {
    type: StatsType.MONTH,
    name: 'Month'
  },
  {
    type: StatsType.YEAR,
    name: 'Year'
  }
];

const renderStatisticsChart = (statisticCtx, { genres }) =>
  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres.types,
      datasets: [{
        data: genres.values,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

const createFiltersTemplate = (filters, currentFilter) => `
  ${filters.map(({ type, name }) => `
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${type === currentFilter ? 'checked' : ''}>
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>
  `).join(' ')}
`;

const createStatisticsTemplate = ({ userRank, durationHours, durationMinutes, filmsWatched, topGenre }, filters, currentFilter) => `
  <section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${createFiltersTemplate(filters, currentFilter)}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsWatched.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;


export default class Statistics extends SmartView {
  constructor(films, currentFilter = StatsType.ALL) {
    super();

    this._films = films;
    this._filters = FILTERS;
    this._currentFilter = currentFilter;

    this._statisticCtx = null;
    this._setChart();
    this._filterStatsChangeHandler = this._filterStatsChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatisticsTemplate(
      getDataStatistics(this._films, this._currentFilter),
      this._filters,
      this._currentFilter
    );
  }

  restoreHandlers() {
    this.setFilterStatsChangeHandler();
    this._setChart();
  }

  removeElement() {
    super.removeElement();
  }

  _setChart() {
    if (this._statisticCtx !== null) {
      this._statisticCtx = null;
    }

    const data = getDataStatistics(this._films, this._currentFilter);
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._statisticCtx = renderStatisticsChart(statisticCtx, data);
  }

  _filterStatsChangeHandler(evt) {
    evt.preventDefault();
    this.setCurrentFilter(evt.target.value);
  }

  setFilterStatsChangeHandler() {
    this.getElement().addEventListener('change', this._filterStatsChangeHandler);
  }

  setCurrentFilter(currentFilter) {
    this._currentFilter = currentFilter;
    this.updateData({
      currentFilter
    }, false);
  }
}
