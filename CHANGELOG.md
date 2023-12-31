# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] -- 2023-08-19

- Create the basic models as `user`, `test-case` and `forecast-data`.
- Integrate `ngrx` to the project.
- Create services to append data from json files.
- Add state functionalities from `user`, `test-case` and `forecast-data`.
- Sum the routing to the project.
- Added `user` component to test dispatching the reducers.

## [0.2.0] -- 2023-08-19

- `Chart.js` package added in order to visualize graphs.
- `chartjs-plugin-annotation` plugin appended in order to add box annotations on the fly.
- State management for `warnings` and `selected` (which is the state for the current user and testCase).
- Choose user component appended.
- Test page component added.
- Routing functionality upp and running.


## [0.3.0] -- 2023-08-20

- Add warnings.
- Remove warnings.
- Visualize warnings.
- Load previous warnings.


## [0.3.1] -- 2023-08-21

- README file updated.

## [0.4.0] -- 2023-08-27

- Local storage functionality.
- Dispatchers, is now a class in order to pass the `store` as a parameter.
- Encapsulation of chartService.
- Button widget. There are 4 types:
  - Primary
  - Secondary
  - Small primary
  - Small secondary
- Select widget.
- Refactor User Component.
- Reset select components in user component after saving a warning.
- Change from signals to Subjects and Subscriptions to isolate the component.


## [0.4.1] -- 2023-09-05

- Chart functionality encapsulated in a component.
- Table component created.


## [0.4.2] -- 2023-09-05

- Modal component.
- Modal component at pushing switch user.


## [0.5.0]

- Tests for the ForecastService.
- Tests for the TestCaseService.
- Tests for the UserService.
