# Info

This`s unofficial fork of [RudderStack](https://rudderstack.com/)  config generator. The main goal of fork is keep compitables withs current version of RudderStack server](https://github.com/rudderlabs/rudder-server).

# What is RudderStack?

[RudderStack](https://rudderstack.com/) is a **customer data pipeline** tool for collecting, routing and processing data from your websites, apps, cloud tools, and data warehouse.

More information on RudderStack can be found [here](https://github.com/rudderlabs/rudder-server).

## RudderStack Control Plane Lite

RudderStack has two components: _control plane_ and _data plane_.

The data plane reliably delivers your event data, while the control plane manages the configuration of your sources and destinations.

> To learn more about the data plane and control plane, refer to the [RudderStack Architecture](https://www.rudderstack.com/docs/resources/rudderstack-architecture/).

RudderStack's Control Plane Lite utility provides the UI to self-host and manage these source and destination configurations. All the source and destination configuration stays on your local storage. You can also export or import these configurations to a JSON file.

> To read more about the Control Plane Lite utility, refer to the [RudderStack documentation](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-lite/).

## Setup

Requirement: Use `Node.js v14` for the best experience. (`Node v16` and higher versions are not supported)

To set up the RudderStack Control Plane Lite, run the following commands:

1. `npm install`
2. `npm start`

The Control Plane Lite starts on the default port i.e., `http://localhost:3000`.

On a successful setup, you should see the following:

![configGenScreenshot](https://user-images.githubusercontent.com/9196093/139224985-28c795cb-d130-4525-a41f-451dba0ac384.png)

## Exporting workspace configuration

After adding the required sources and destinations, export your workspace config. This workspace config is required by the [RudderStack server](https://github.com/rudderlabs/rudder-server).

> To learn more about adding sources and destinations in RudderStack, refer to the [RudderStack documentation](https://www.rudderstack.com/docs/dashboard-guides/overview/).

Update the [config](https://docs.rudderstack.com/administrators-guide/config-parameters) variables `configFromFile` and `configJSONPath` in your RudderStack server to read the workspace configuration from the exported JSON file.

## Starting RudderStack with the workspace config file

1. Download the workspace config file on your machine.
2. In `docker-compose.yml`, uncomment `volumes` section under `backend` service. Specify the path to your workspace config.
3. In `build/docker.env`, set the environment variable `RSERVER_BACKEND_CONFIG_CONFIG_FROM_FILE=true`
4. Start RudderStack by running the command `docker-compose up`

For more information, refer to the [RudderStack documentation](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-lite/).

## Exporting source configuration

After adding the required sources and destinations, export your source config for the sources. This source config is required by the RudderStack SDKs. After downloading the source config file, you need to host that file on the `/sourceConfig` end-point. Then, specify that link as your `controlPlaneUrl` while initializing the SDK.

## More information

For more information and documentation related to the RudderStack Control Plane Lite, refer to the [RudderStack documentation](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-lite/).

Some more points to note:

- You can make use of the `addDestinationSource.js` file in the `src/scripts` to automatically generate the required config code automatically. 
- Make use of the print functions to generate the code in the required format. 
- You can alter the `printConfig` function to generate the config for your sources or destinations.

## Contact us

If you come across any issues while configuring or using the RudderStack Control Plane Lite, feel free to start a conversation on our [Slack](https://resources.rudderstack.com/join-rudderstack-slack) channel.
