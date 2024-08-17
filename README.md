# BITS WILP Course Content Downloader

This CLI tool provides various functionalities to interact with the BITS portal, including logging in, managing courses, and handling course content. Below are the available commands and their usage:

## Pre-requisites :

### 1. Node JS

Install the latest version of Node for your system. You can find verbose instructions below : <br>
https://nodejs.org/en/download/package-manager

## Setup Steps :

### 1. Run the following command to download and install the CLI tool To start the project :

```
npm i @risabhkedai/bits-wilp-downloader -g
```

### 2. Check if the CLI tool is correctly installed by running the command :

```
wilp-dwnld --help
```

The output should show commands available.

## Commands and usages :

### `login <username> <password>`

- **Description**: Logs into the BITS portal with the provided username and password.
- **Parameters**:
  - `username`: Your email or user name.
  - `password`: Your account password.

### `course`

- **Description**: Manage courses with various subcommands.

  #### Subcommands:

  - `list`

    - **Description**: Retrieves and displays a list of available courses.

  - `download`

    - **Description**: Downloads courses based on the specified options.
    - **Options**:
      - `--all, -a`: Download all courses. If this option is not provided, a single course will be downloaded interactively.

  - `merge-content`
    - **Description**: Merges all PPT and PDF files for a specified course into a single folder.

### `clean`

- **Description**: Cleans up all data created during operations, including course data and content.
