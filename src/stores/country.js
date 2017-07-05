import { action, extendObservable } from 'mobx';

class Country {

  constructor() {
    extendObservable(this, {
      id: null,
      name: null,
      visits: []
    })
  }

  setId = action((val) => {
    this.id = val;
  });

  setName = action((val) => {
    this.name = val;
  });

  setVisits = action((visits, shouldProcess) => {
    this.visits = shouldProcess ? process(visits) : visits;
  });

}

function process(items) {
  return items.map((item, index) => {
    item.shouldRender = false;
    item.isRendered = false;
    item.isDisplayed = false;
    item.monthYear = calcMonthYear(item.from);
    item.type = item.type.map((type) => {
      return type === 'sv' ? 'State visit' : type;
    });

    return item;
  });
}

function calcMonthYear(date) {
  const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = parseInt(date.substr(3,2), 10),
    year = date.substr(6);

  return months[month] + ' ' + year;
}

const country = new Country();

export default country;

export { Country };