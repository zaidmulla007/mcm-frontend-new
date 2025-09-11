/**
 * Get current quarter based on month (0-based)
 */
export const getCurrentQuarter = (month) => {
  if (month <= 2) return 1; // Jan, Feb, Mar
  if (month <= 5) return 2; // Apr, May, Jun
  if (month <= 8) return 3; // Jul, Aug, Sep
  return 4; // Oct, Nov, Dec
};

/**
 * Generate dynamic years array
 * @param {number} startYear - Starting year (default: 2022)
 * @param {boolean} includeNextYear - Whether to include next year (default: false)
 */
export const getAvailableYears = (startYear = 2022, includeNextYear = false) => {
  const currentYear = new Date().getFullYear();
  const endYear = includeNextYear ? currentYear + 1 : currentYear;
  
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

/**
 * Get available quarters for a specific year
 * @param {number} year - The year to get quarters for
 */
export const getAvailableQuarters = (year) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentQuarter = getCurrentQuarter(currentMonth);

  const allQuarters = [
    { value: 1, label: 'Q1' },
    { value: 2, label: 'Q2' },
    { value: 3, label: 'Q3' },
    { value: 4, label: 'Q4' }
  ];

  // If it's the current year, only show quarters up to current quarter
  if (year === currentYear) {
    return allQuarters.filter(q => q.value <= currentQuarter);
  }
  
  // If it's a future year, don't show any quarters (or show all for planning)
  if (year > currentYear) {
    return []; // Change to allQuarters if you want to allow future quarters
  }

  // For past years, show all quarters
  return allQuarters;
};

/**
 * Generate year options for the dropdown including "All Years"
 * @param {number} startYear - Starting year (default: 2022)
 * @param {boolean} includeNextYear - Whether to include next year (default: false)
 */
export const getYearOptions = (startYear = 2022, includeNextYear = false) => {
  const years = getAvailableYears(startYear, includeNextYear);
  const options = [{ value: "all", label: "All Years" }];
  
  // Reverse the years array to show current year first (descending order)
  years.reverse().forEach(year => {
    options.push({ value: year.toString(), label: year.toString() });
  });
  
  return options;
};

/**
 * Generate quarter options for the dropdown including "All Quarters"
 * @param {string|number} selectedYear - The selected year (can be "all" or a year number)
 */
export const getQuarterOptions = (selectedYear) => {
  const options = [{ value: "all", label: "All Quarters" }];
  
  // If no year is selected or "all" is selected, return only "All Quarters"
  if (!selectedYear || selectedYear === "all") {
    return options;
  }
  
  const year = parseInt(selectedYear);
  const availableQuarters = getAvailableQuarters(year);
  
  availableQuarters.forEach(quarter => {
    const label = `${quarter.label} (${getQuarterMonths(quarter.value)})`;
    options.push({ 
      value: quarter.label, // Use Q1, Q2, Q3, Q4 format to match API
      label: label 
    });
  });
  
  return options;
};

/**
 * Get month range for a quarter
 * @param {number} quarter - Quarter number (1-4)
 */
export const getQuarterMonths = (quarter) => {
  const quarterMonths = {
    1: "Jan-Mar",
    2: "Apr-Jun", 
    3: "Jul-Sep",
    4: "Oct-Dec"
  };
  return quarterMonths[quarter] || "";
};

// Example usage in your component:
/*
import { getYearOptions, getQuarterOptions } from './utils/dateFilterUtils';

const MyComponent = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');

  const availableYears = getYearOptions(2022); // Start from 2022
  const availableQuarters = getQuarterOptions(selectedYear);

  // Reset quarter when year changes and current quarter is not available
  useEffect(() => {
    if (selectedYear && availableQuarters.length > 0) {
      const isQuarterValid = availableQuarters.some(q => q.value === selectedQuarter);
      if (!isQuarterValid) {
        setSelectedQuarter('all');
      }
    }
  }, [selectedYear]);

  return (
    // Your JSX here
  );
};
*/