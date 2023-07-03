import moment, { Moment }  from "moment";

export const momentUtilFormat=(date:string)=>{
    return moment().format('hh:mm')
}

export function getDateDifference(startDate: string): string {
    const startMoment: Moment = moment(startDate);
    const endMoment: Moment = moment();
  
    const diff: number = endMoment.diff(startMoment);
  
    const duration: moment.Duration = moment.duration(diff);
  
    if (duration.asMinutes() < 60) {
      const minutes = duration.asMinutes();
      return `${minutes.toFixed(0)} ${getUnitLabel(minutes, 'minuto')}`;
    } else if (duration.asHours() < 24) {
      const hours = duration.asHours();
      return `${hours.toFixed(0)} ${getUnitLabel(hours, 'hora')}`;
    } else if (duration.asWeeks() < 4) {
      const weeks = duration.asWeeks();
      return `${weeks.toFixed(0)} ${getUnitLabel(weeks, 'semana')}`;
    } else if (duration.asMonths() < 12) {
      const months = duration.asMonths();
      return `${months.toFixed(0)} ${getUnitLabel(months, 'mes')}`;
    } else {
      const years = duration.asYears();
      return `${years.toFixed(0)} ${getUnitLabel(years, 'año')}`;
    }
  }
  
  function getUnitLabel(value: number, unit: string): string {
    return value < 2 ? unit : `${unit}s`;
  }