# Mapper

## Install

```shell
composer create-project geo6/mapper
```

## Authentication

To enable authentication, add the following in your configuration file (usually `config/autoload/local.php`) :

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

See <https://docs.zendframework.com/zend-expressive-authentication/v1/user-repository/#pdo-configuration> for more information !

## Configuration

### Baselayers

A baselayer can be a XYZ, a WMS, or a WMTS service.

`config/application/baselayers.yaml`

```yaml
---
baselayers:
  osmbe:
    name: OpenStreetMap Belgium
    url: https://tile.osm.be/osmbe/{z}/{x}/{y}.png
    attributions:
      - © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.
      - Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>
    maxZoom: 18

  cirb_ortho:
    name: "Bruxelles-Brussel (OrthoPhotos 2018)"
    url: https://geoservices-urbis.irisnet.be/geoserver/ows/
    mode: wms
    layers: ['Ortho2018']
    attributions: ['CIRB © CIBG']

  aiv_grb_wmts:
    name: "Vlaanderen (Vector: GRB)"
    url: https://tile.informatievlaanderen.be/ws/raadpleegdiensten/wmts/
    mode: wmts
    layer: grb_bsk
    attributions: ['© AIV']
```

## Layers

...

## Files

...
