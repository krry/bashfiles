# Proposal Calculations

See FLNL-13 for Rates API reqs. See FLNL-9 for Utilities API.

## Figures
### Rates
* send ZIP code to Rates API
* `utility_rate = localUtilityAvg`
* display most likely utility rate in the ZIP
* `scty_rate = localAvgPrice`
* display PPA, or if no PPA, avg. lease rate

### Savings
* `first_year_savings = (annual_production < annual_consumption * 0.8) ? (bill * 12) - (annual_production * scty_rate) : (bill * 12) - (annual_consumption * 0.8 * scty_rate)`
* `percent_savings = 100 * (utility_rate - scty_rate) / utility_rate`

### Percent Offset
`percent_solar = (annual_production/annual_consumption < 80) ? annual_production*100/annual_consumption : 80`

### Upfront Cost
* `upfront_cost` = 0

## Variables
* `upfront_cost` => 0
* `annual_consumption` => `bill * 12`
* `utility_rate`
* `scty_rate`
* `percent_savings`
* `annual_production`
* `first_year_savings`
* `percent_solar`
