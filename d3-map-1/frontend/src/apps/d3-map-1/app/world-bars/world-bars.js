import React, {Component} from 'react';
import styles from './style.css';

export default class Spiral extends Component {
  componentDidMount() {
    //**init settings
    this.onResize = this.onResize.bind(this);
    this.onOutClick = this.onOutClick.bind(this);
    addEventListener('resize', this.onResize);
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    //** svg container
    this.svg = d3.select(this.node).append('svg');

    //** svg clickable background
    this.gBack = this.svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.w)
      .attr('height', this.h)
      .style('fill', '#steelblue');

    //** g for map
    this.gg = this.svg
        .append('g');

    //** projection
    this.projection = d3.geoMercator()
        .scale(100)
        .translate([this.w / 2, this.h / 2 + 150]);

    //** path where to draw
    this.path = d3.geoPath()
        .projection(this.projection);

    this.zoom = d3.zoom()
        .duration(1500)
        .scaleExtent([1, 8])
        .translateExtent([[0,0], [this.w, this.h]])
        .extent([[0, 0], [this.w, this.h]])
        .on('end', () => {
          this.renderLands();
        })
        .on('zoom', () => {
          this.gg.attr('transform', d3.event.transform);
        });

    d3.json('./countries.topo.json', (error, us) => {
      if (error) {
        console.log('error ', error);
        throw error;
      }
      this.countries = topojson.feature(us, us.objects.countries).features;
      this.onResize();
    });

    //** background click
    this.gBack.on('click', () => {
      this.onOutClick();
    });
  }

  renderLands() {
    let rects = this.gg.selectAll('path')
      .data(this.countries.filter((d) => {
        return d;
      }));

    rects
      .enter().append('path')
      .attr("class", styles.country)
      .attr('d', this.path)
      .on('mouseover', (d, a, b) => {
        this.hoverCountry(d);
      })
      .on('mouseout', (d, a, b) => {
      })
      .on('click', (d, a, b) => {
        if (this.selectedDDD) {
          d3.select(this.selectedDDD.x)
            .classed(styles.selectedCountry, false)

          d3.select(this.selectedDDD.x)
            .attr('class', styles.country);
        }
        this.selectedD = d.id;
        this.selectedDDD = {
          x: b[a]
        };

        d3.select(b[a])
          .attr('class', styles.selectedCountry);
        this.renderZoomArea(d);
      });
    //**REMOVE
    rects
      .exit()
      .remove();
  }

  onResize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.gBack
    .attr('width', this.w)
    .attr('height', this.h);

    TweenMax.to(this.svg.node(), 1, {
      width: this.w,
      height: this.h,
      ease: window.Power4.easeOut
    });

    this.renderZoom();
  }

  onOutClick() {
    this.renderZoom();
  }

  renderZoom() {
    d3.selectAll('path')
      .classed(styles.allCountries, false)
      .classed(styles.selectedCountry, false)
      .classed(styles.country, true)
    //** opt. avoid useless loop and store results */
    if (!this.minLeft) {
      let minLeft = d3.min(this.countries.map((array) => {
        let bounds = this.path.bounds(array);
        return d3.min(bounds, (d) => {
          return Number(d[0]);
        });
      }));
      let maxRight = d3.max(this.countries.map((array) => {
        let bounds = this.path.bounds(array);
        return d3.max(bounds, (d) => {
          return Number(d[0]);
        });
      }));
      let minTop = d3.min(this.countries.map((array) => {
        let bounds = this.path.bounds(array);
        return d3.min(bounds, (d) => {
          return Number(d[1]);
        });
      }));
      let maxBottom = d3.max(this.countries.map((array) => {
        let bounds = this.path.bounds(array);
        return d3.max(bounds, (d) => {
          return Number(d[1]);
        });
      }));

      this.minLeft = minLeft;
      this.maxRight = maxRight;
      this.minTop = minTop;
      this.maxBottom = maxBottom;
    }

    let dx = this.maxRight - this.minLeft;
    let dy = this.maxBottom - this.minTop;
    let x = (this.minLeft + this.maxRight) / 2;
    let y = (this.minTop + this.maxBottom) / 2;
    let scale = Math.max(1, Math.min(3, 0.9 / Math.max(dx / this.w, dy / this.h)));
    this.updateScale(scale);
    let translate = [this.w / 2 - scale * (x), this.h / 2 - scale * y];
    this.svg.transition()
          .duration(1200)
          .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  renderZoomArea(d) {

    d3.selectAll('path')
      .classed(styles.allCountries, true);
    let scaleBase = 25;
    this.activeD = d;
    let test = {
      geometry: d.geometry,
      type: d.type
    };
    let bounds = this.path.bounds(test),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(scaleBase, 0.5 / Math.max(dx / this.w, dy / this.h))),
      translate = [this.w / 2 - scale * x, this.h / 2 - scale * y];
    this.updateScale(scale);
    this.svg.transition()
        .duration(1200)
        .delay(200)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));
  }

  updateScale(scale) {
    this.scalePath = scale;
    this.renderLands();
  }
  hoverCountry(d) {
    let name = d.properties.name;
    this.setState({
      countryLabel: name
    });
  }
  render() {
    let t = 'x';
    if (this.state) {
      t = this.state.countryLabel;
    }
    return (
      <div>
        <div className={styles.title}>
          <span>{t}</span>
        </div>
        <div
          ref={(element) => {
            this.node = element;
          }}>
        </div>
      </div>
    );
  }
}
