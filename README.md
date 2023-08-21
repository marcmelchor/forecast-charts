# ForecastCharts

In order to give the meteorologists a tool where they can easily interact with forecast data and feedback produced by them.
This application was built on [Angular 16.2.0](https://github.com/angular/angular-cli).

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
  - [State Management](#state-management)
  - [Charts](#charts)
  - [Pagination](#pagination)
  - [Add and remove warnings](#add-and-remove-warnings)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## Project Overview

The `forecast-charts` integrates a visualization process where users can add different warnings that the person in charge
of a `Meteorologist` organization compares the results.


## Features

- ### State Management
  Encapsulate all the desired behavior using `ngrx`, there are the next state modules with their respective `model`, `actions`, `reducers`, `selector`, `state` and `effect` (if it's required):
  - `forecast-data`
  - `selected`
  - `test-cases`
  - `users`
  - `warnings`

- ### Charts
  In order to visualize the data, it was the library `chart.js` and the plugin `chartjs-plugin-annotation` to add the warning boxes.

- ### Pagination
  Navigate through all different available `test-cases`.

- ### Add and remove warnings
  Having in mind that this is also a module from the state management, you have the certainty that these values are stored.


## Installation

Follow this steps to get `forecast-charts` up and running:

1. Be sure to have AngularCLI installed in your machine.
2. Clone this repository `git clone https://github.com/marcmelchor/forecast-charts.git`.
3. Build the project `ng build`.
4. Run the project `ng serve`.


## Usage

Once the application is up and running, you can check on your browser at `http://localhost:4200`.

- Select a user from the previously provided list.
- Navigate through the different `Forecast data` grouped by `region/city`.
- At the moment to navigate to a new `Forecast` it should load it from the previously provided set of data.
- Add new warnings, selecting starting time and ending time, you should also add a warning type.
- You should be able to see the boxes containing the range before selected.
- Remove the warnings, and you should be able to see how they are also removed from the visualization.
- Having some warnings stored, switch through different `Forecast data`, if you have saved some warnings, you should be able to see them integrated.


## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-new-feature`
3. Make changes and commit: `git commit -am 'Add new feature'`
4. Push the branch: `git push origin feature-new-feature`
5. Open a pull request.


## License

This project is licensed under the <u>[MIT License](https://opensource.org/license/mit/)</u>.


## Contact

For questions or feedback, you can reach me at <u>marc.melchor@outlook.com</u> or follow me on <b>LinkedIn</b> <u>@marc-melchor</u>.
