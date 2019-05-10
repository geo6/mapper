# Mapper

## Install

```shell
composer create-project geo6/mapper
```

## Authentication

To enable authentication, add the following in `config/autoload/local.php` :

```php
'authentication' => [
    'pdo' => [
        'dsn' => 'pgsql:host=localhost;port=5432;dbname=...',
        'username' => '...',
        'password' => '...',
        'table' => '...',
        'field' => [
            'identity' => '...',
            'password' => '...',
        ],
        'sql_get_roles' => '...',
        'sql_get_details' => '...',
    ],
],
```

See [Zend Expressive Authentication configuration](https://docs.zendframework.com/zend-expressive-authentication/v1/user-repository/#pdo-configuration) for more information !

## Configuration

You can write your configuration files using any format compatible with [`Zend\Config\Reader`](https://docs.zendframework.com/zend-config/reader/) (`.ini`, `.xml`, `.json`, `.yaml`, `.php`).

### Geocoder providers (global)

The geocoding uses [Geocoder PHP library](https://github.com/geocoder-php/Geocoder). A list of providers is available [here](https://github.com/geocoder-php/Geocoder#providers).

1. Install the new provider

    ```shell
    composer install <geocoder-provider-package>
    ```

2. Add the new provider in `src/App/Handler/Geocoder/AddressHandler.php` (and in `src/App/Handler/Geocoder/ReverseHandler.php` if reverse geocoding is available)

3. Then, declare the newly installed provider in `config/autoload/geocoder.global.php` file

    ```php
    '<provider-name>' => [
        'reverse' => true|false,
        'title'   => '<provider-title>',
    ],
    ```

    | Parameter | Type      | Description                                  |
    | --------- | --------- | -------------------------------------------- |
    | `reverse` | *boolean* | Does the service provide reverse geocoding ? |
    | `title`   | *string*  | Provider display title.                      |

### Coordinates Reference Systems (global)

File `config/autoload/epsg.global.php`

```php
'<projection-code>' => [
    'name'  => '<projection-name>',
    'proj4' => '<projection-proj4-definition>',
],
```

| Parameter | Type     | Description                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| `name`    | *string* | Projection display name.                                         |
| `proj4`   | *string* | [PROJ.4](https://proj4.org/) definition. See <https://epsg.io/>. |

### Custom configuration

Custom configuration is defined by "project". Those "projects" can be define by role, user or be available for everyone (= *public*).

To declare a new "project", just create a new folder in one of those directories:

- `config/application/public/`
- `config/application/roles/<rolename>/`
- `config/application/users/<username>/`

You will then be able to access a "project" by adding `?c=<project-foldername>` in the URL.

If you want the same baselayers for every "project", you can configure your baselayers in a global `config/application/baselayers.yaml` file.

### Project

```yaml
---
title: <project-title>
description: <project-description>
map:
    center: [<project-default-map-center-longitude>, <project-default-map-center-latitude>]
    zoom: <project-default-map-zoom>

```

| Parameter               | Type      | Description                                                   |
| ----------------------- | --------- | ------------------------------------------------------------- |
| `title`                 | *string*  | Project display title.                                        |
| `description`           | *string*  | Project description (available in "About" sidebar tab).       |
| `map.center` (optional) | *float[]* | Project default map center coordinates (Longitude, Latitude). |
| `map.zoom` (optional)   | *float[]* | Project default map zoom level.                               |

### Baselayers

```yaml
---
baselayers:
  <baselayer-1>
  <baselayer-2>
  ...
```

Replace  `<baselayer-#>` by one of the following (XYZ, WMS, WMTS):

#### XYZ baselayer

```yaml
<baselayer-id>:
  name: <baselayer-name>
  url: <baselayer-url>
  attributions:
    - <baselayer-attribution-1>
    - <baselayer-attribution-2>
    - ...
  maxZoom: <baselayer-max-zoom>
```

| Parameter                 | Type       | Description                   |
| ------------------------- | ---------- | ----------------------------- |
| `name`                    | *string*   | Baselayer display name.       |
| `url`                     | *string*   | Baselayer (service) URL.      |
| `attributions` (optional) | *string[]* | Baselayer attribution(s).     |
| `maxZoom` (optional)      | *integer*  | Baselayer maximum zoom level. |

#### WMS baselayer

```yaml
<baselayer-id>:
  mode: wms
  name: <baselayer-name>
  url: <baselayer-service-url>
  layers: [<layer-1-id>, <layer-2-id>, ...]
  attributions:
    - <baselayer-attribution-1>
    - <baselayer-attribution-2>
    - ...
```

| Parameter                 | Type       | Description                    |
| ------------------------- | ---------- | ------------------------------ |
| `name`                    | *string*   | Baselayer display name.        |
| `url`                     | *string*   | Baselayer service URL.         |
| `layers`                  | *string[]* | Baselayer service layers name. |
| `attributions` (optional) | *string[]* | Baselayer attribution(s).      |

#### WMTS baselayer

```yaml
<baselayer-id>:
  mode: wmts
  name: <baselayer-name>
  url: <baselayer-service-url>
  layer: <layer-id>
  attributions:
    - <baselayer-attribution-1>
    - <baselayer-attribution-2>
    - ...
```

| Parameter                 | Type       | Description                   |
| ------------------------- | ---------- | ----------------------------- |
| `name`                    | *string*   | Baselayer display name.       |
| `url`                     | *string*   | Baselayer service URL.        |
| `layer`                   | *string[]* | Baselayer service layer name. |
| `attributions` (optional) | *string[]* | Baselayer attribution(s).     |

### Layers

```yaml
---
layers:
  <layer-1>
  <layer-2>
  ...
```

Replace  `<layer-#>` by one of the following (WMS, WMTS):

#### WMS layer

```yaml
- type: wms
  url: <service-url>
  proxy: true|false
  auth:
    type: digest
    username: <service-username>
    password: <service-password>
  layers: []
  maxZoom: <service-maxzoomlevel>
```

| Parameter                  | Type       | Description                                                       |
| -------------------------- | ---------- | ----------------------------------------------------------------- |
| `url`                      | *string*   | WMS service URL.                                                  |
| `proxy` (optional)         | *boolean*  | Use *Mapper* application as proxy to query the WMS service ?      |
| `auth.type` (optional)     | *string*   | Type of authentication used by the WMS service (basic or digest). |
| `auth.username` (optional) | *string*   | Username for the authentication.                                  |
| `auth.password` (optional) | *string*   | Password for the authentication.                                  |
| `layers` (optional)        | *string[]* | List of layers displayed by default.                              |
| `maxZoom` (optional)       | *integer*  | WMS service maximum zoom level.                                   |

#### WMTS layer

```yaml
- type: wmts
  url: <service-url>
```

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `url`     | *string* | WMS service URL. |

### Layers

```yaml
---
files:
    - type: <file-type>
      path: <file-path>
    - ...
```

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `type`    | *string* | `csv`, `geojson`, `gpx`, or `kml`. |
| `path`    | *string* | Path of a file or a directory.     |
