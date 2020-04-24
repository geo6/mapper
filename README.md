# Mapper

![JavaScript CI](https://github.com/geo6/mapper/workflows/JavaScript%20CI/badge.svg)
![PHP CI](https://github.com/geo6/mapper/workflows/PHP%20CI/badge.svg)
[![Latest Stable Version](https://poser.pugx.org/geo6/mapper/v/stable)](https://packagist.org/packages/geo6/mapper)
[![Total Downloads](https://poser.pugx.org/geo6/mapper/downloads)](https://packagist.org/packages/geo6/mapper)
[![Monthly Downloads](https://poser.pugx.org/geo6/mapper/d/monthly.png)](https://packagist.org/packages/geo6/mapper)
[![Software License](https://img.shields.io/badge/license-GPL--3.0-brightgreen.svg)](LICENSE)

## Features

- Baselayers
- Address or POI geocoding
- Location reverse geocoding
- Draw
- Measure distances and surfaces
- Add services (see hereunder)
- Upload files (see hereunder)
- Query files and services (by clicking in the map)

The _Mapper_ supports the following services and file formats :

- Services:
  - WMS: <http://www.opengeospatial.org/standards/wms/>
  - WMTS: <http://www.opengeospatial.org/standards/wmts/>
- File formats:
  - CSV: <https://tools.ietf.org/html/rfc4180> (RFC4180) (with WKT support)
  - GeoJSON: <https://tools.ietf.org/html/rfc7946> (RFC7946)
  - GPX: <https://www.topografix.com/gpx.asp>
  - KML: <https://www.opengeospatial.org/standards/kml/>

## Install

See [INSTALL.md](INSTALL.md)

## Configuration

The application is configured for Belgium (geocoding services, baselayers, ...) but you can easily adapt the configuration to your use case.

See [INSTALL.md#Configuration](INSTALL.md#Configuration)
