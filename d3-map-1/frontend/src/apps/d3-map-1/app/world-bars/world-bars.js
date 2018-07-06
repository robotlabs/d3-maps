import React, {Component} from 'react';
import styles from './style.css';

export default class Spiral extends Component {
  componentDidMount() {
    //**init settings
    this.onResize = this.onResize.bind(this);
    this.onOutClick = this.onOutClick.bind(this);
    addEventListener('resize', this.onResize);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.color = d3.scaleLinear()
      .domain([0, 100])
      .range(["yellow", "black"]);

    //** svg container
    let svgContainer = document.getElementById('svgContainer');
    this.svg = d3.select(svgContainer).append('svg');

    //** svg clickable background
    this.gBack = this.svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this.width)
      .attr("height", this.height)
      .style("fill", "steelblue");

    //** g for map
    this.gg = this.svg
        .append('g');

    //** background click
    this.gBack.on("click", () => {
      this.onOutClick();
    });

    //** projection
    this.projection = d3.geoMercator()
        .scale(100)
        .translate([this.width / 2, this.height / 2 + 150]);

    //** path where to draw
    this.path = d3.geoPath()
        .projection(this.projection);

    this.zoom = d3.zoom()
        .duration(1500)
        .scaleExtent([1, 8])
        .translateExtent([[0,0], [this.width, this.height]])
        .extent([[0, 0], [this.width, this.height]])
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
      console.log('test yes');
      
      this.onResize();
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
    let w = window.innerWidth;
    let h = window.innerHeight;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.gBack
    .attr("width", this.width)
    .attr("height", this.height);

    TweenMax.to(this.svg.node(), 1, {
      width: w,
      height: h,
      ease: window.Power4.easeOut
    });

    this.renderZoom();
  }

  onOutClick() {
    this.renderZoom();
  }

  renderZoom() {
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

    let dx = maxRight - minLeft;
    let dy = maxBottom - minTop;
    let x = (minLeft + maxRight) / 2;
    let y = (minTop + maxBottom) / 2;
    let scale = Math.max(1, Math.min(3, 0.9 / Math.max(dx / this.width, dy / this.height)));
    let translate = [this.width / 2 - scale * (x), this.height / 2 - scale * y];
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
      //scale = Math.max(5, Math.min(20 / Math.max(dx / this.w, dy / this.h), 0.5 / Math.max(dx / this.w, dy / this.h))),
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
        }}
        className={this.props.g1ClassName}>
        <div className={styles.canvasDiv} ref='canvasHolder'></div>
      </div>
    );
  }
}
