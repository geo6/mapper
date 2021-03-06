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

You can write your configuration files using any format compatible with [`Laminas\Config\Reader`](https://docs.zendframework.com/laminas-config/reader/) (`.ini`, `.xml`, `.json`, `.yaml`, `.php`).

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
   | `reverse` | _boolean_ | Does the service provide reverse geocoding ? |
   | `title`   | _string_  | Provider display title.                      |

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
| `name`    | _string_ | Projection display name.                                         |
| `proj4`   | _string_ | [PROJ.4](https://proj4.org/) definition. See <https://epsg.io/>. |

### Custom configuration

Custom configuration is defined by "project". Those "projects" can be define by role, user or be available for everyone (= _public_).

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
  center:
    [
      <project-default-map-center-longitude>,
      <project-default-map-center-latitude>,
    ]
  zoom: <project-default-map-zoom>
```

| Parameter               | Type      | Description                                                   |
| ----------------------- | --------- | ------------------------------------------------------------- |
| `title`                 | _string_  | Project display title.                                        |
| `description`           | _string_  | Project description (available in "About" sidebar tab).       |
| `map.center` (optional) | _float[]_ | Project default map center coordinates (Longitude, Latitude). |
| `map.zoom` (optional)   | _float[]_ | Project default map zoom level.                               |

### Baselayers

```yaml
---
baselayers: <baselayer-1>
  <baselayer-2>
  ...
```

Replace `<baselayer-#>` by one of the following (XYZ, WMS, WMTS):

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
| `name`                    | _string_   | Baselayer display name.       |
| `url`                     | _string_   | Baselayer (service) URL.      |
| `attributions` (optional) | _string[]_ | Baselayer attribution(s).     |
| `maxZoom` (optional)      | _integer_  | Baselayer maximum zoom level. |

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
| `name`                    | _string_   | Baselayer display name.        |
| `url`                     | _string_   | Baselayer service URL.         |
| `layers`                  | _string[]_ | Baselayer service layers name. |
| `attributions` (optional) | _string[]_ | Baselayer attribution(s).      |

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
| `name`                    | _string_   | Baselayer display name.       |
| `url`                     | _string_   | Baselayer service URL.        |
| `layer`                   | _string[]_ | Baselayer service layer name. |
| `attributions` (optional) | _string[]_ | Baselayer attribution(s).     |

### Services

```yaml
---
services:
  - <service-1>
  - <service-2>
    ...
```

Replace `<service-#>` by one of the following (WMS, WMTS):

#### WMS layer

```yaml
- type: wms
  url: <service-url>
  proxy: true|false
  auth:
    type: digest
    username: <service-username>
    password: <service-password>
  default: []
  maxZoom: <service-maxzoomlevel>
```

| Parameter                  | Type       | Description                                                       |
| -------------------------- | ---------- | ----------------------------------------------------------------- |
| `url`                      | _string_   | WMS service URL.                                                  |
| `proxy` (optional)         | _boolean_  | Use _Mapper_ application as proxy to query the WMS service ?      |
| `auth.type` (optional)     | _string_   | Type of authentication used by the WMS service (basic or digest). |
| `auth.username` (optional) | _string_   | Username for the authentication.                                  |
| `auth.password` (optional) | _string_   | Password for the authentication.                                  |
| `default` (optional)       | _string[]_ | List of layers displayed by default.                              |
| `maxZoom` (optional)       | _integer_  | WMS service maximum zoom level.                                   |

#### WMTS layer

```yaml
- type: wmts
  url: <service-url>
```

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `url`     | _string_ | WMS service URL. |

### Files

```yaml
---
files:
  - type: <file-type>
    path: <file-path>
  - ...
```

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `type`    | _string_ | `csv`, `geojson`, `gpx`, or `kml`. |
| `path`    | _string_ | Path of a file or a directory.     |
