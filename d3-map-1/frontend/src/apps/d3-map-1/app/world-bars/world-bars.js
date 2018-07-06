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

    this.color = d3.scaleLinear()
      .domain([0, 100])
      .range(['yellow', 'black']);

    //** svg container
    this.svg = d3.select(this.node).append('svg');

    //** svg clickable background
    this.gBack = this.svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.w)
      .attr('height', this.h)
      .style('fill', 'steelblue');

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

    //** REMOVE
    rects
      .exit()
      .remove();

    //** UPDATE
    rects
      .transition()
      .duration(500)
      .ease(d3.easeCubic)
      .attr('d', this.path)
      .attr('fill', (d) => {
        return '#2b2c3d';
      })
      .style('stroke-width', 1)
			.style('stroke', 'black');

    //** ADD
    rects
        .enter().append('path')
        .attr('d', this.path)
        .attr('fill', (d) => {
          return '#726767';
        })
        .style('stroke-width', 1)
        .style('stroke', 'black')
        .style('cursor', 'pointer')
        .on('mouseover', (d, a, b) => {
          // let rn = Math.floor(Math.random() * 100)
          // d3.select(b[a])
            // .style('fill', this.color(rn));
        })
        .on('mouseout', (d, a, b) => {
          // .style('fill', '#726767');
        })
        .on('click', (d) => {
          this.renderZoomArea(d)
        });
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
    let translate = [this.w / 2 - scale * (x), this.h / 2 - scale * y];
    this.svg.transition()
          .duration(1200)
          .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  renderZoomArea(d) {
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
    this.scale = scale;
    this.svg.transition()
        .duration(1200)
        .delay(200)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));
  }
  render() {
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}>
      </div>
    );
  }
}
