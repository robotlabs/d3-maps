import React, {Component} from 'react';
import styles from './style.css';

export default class Spiral extends Component {
  componentDidMount() {
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
    };
    //**init settings
    this.selectedColor = '#ff0099';
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
    let strokePerc = (1 / this.scalePath);
    let rects = this.gg.selectAll('path')
      .data(this.countries.filter((d, a, b) => {
        // if (d.id === this.selectedD) {
        //   d3.selectAll('path')
        //   .classed(styles.selectedCountry, false)
        // }
        
        return d;
      }));

    let enterSel = rects
      .enter().append('path')
      .attr("class", styles.country)
      .attr('d', this.path)
      // .on('mouseover', (d, a, b) => {
      //   if (d.id !== this.selectedD) {
      //     // this.hoverId = d.id;
      //     d3.select(b[a])
      //     .style('fill', 'red');
      //   }
      // })
      // .on('mouseout', (d, a, b) => {
      //   if (d.id !== this.selectedD) {
      //     // if (d.id === this.hoverId) {
      //     //   this.hoverId = null;
      //     // }
      //     d3.select(b[a])
      //     .style('fill', 'yellow');
      //   }
      // })
      .on('click', (d, a, b) => {
        if (this.selectedDDD) {
          // d3.selectAll('path')
            // .classed(styles.selectedCountry, false)
            d3.select(this.selectedDDD.x)
              .classed(styles.selectedCountry, false)

            d3.select(this.selectedDDD.x)
              .attr('class', styles.country);
        }
        this.selectedD = d.id;
        this.selectedDDD = {
          d: d,
          a: a,
          b: b,
          x: b[a]
        }

        d3.select(b[a])
          .attr('class', styles.selectedCountry)
       // d3.select(b[a])
         // .style('fill', '#ff0099');
        this.renderZoomArea(d);
       // d3.select(b[a]).moveToFront();
        // d3.select(b[a].parentNode.appendChild(b[a]))//.transition().duration(300)
        //.style({'stroke-opacity':1,'stroke':'#F00'});
      });
    //** UPDATE
    /*
    rects
      .merge(enterSel)
      .transition()
      .duration(500)
      .ease(d3.easeCubic)
      .attr('d', this.path)
      .attr("class", styles.country)
      .style('cursor', 'pointer')
      // .transition()
      // .duration(1000)
      .attr('stroke-width', (d) => {
        if (d.id === this.selectedD) {
          return strokePerc * 5;
        } else {
          return strokePerc;
        }
      } )
      .attr('stroke', (d, a, b) => {
        return 'black';
      })
      // .attr('fill', (d, a, b) => {
        // if (d.id !== this.selectedD) {
        //   d3.select(b[a])
        //   .style('fill', 'yellow');
        // }
        
        // return 'yellow'
        // if (d.id === this.selectedD) {
        //   // console.log('WWWWWWW');
        // }
        // if (d.id !== this.selectedD) {
        //   if (this.hoverId !== d.id) {
        //     return 'yellow';
        //   } else {
        //     return 'red';
        //   }
          
        // } else {
        //   // console.log('YOEOOEOEOEOEOEOEOEOE');
        //   return '#ff0099';
        // }
        
        // if (d.id !== this.selectedD && d.id !== this.hoverId) {
        //   let el = d3.select(b[a])
        //   el
        //     .style('fill', 'yellow');
        // }
        
        //     return;
        // if (d.id !== this.selectedD) {
        //   // let el = d3.select(b[a])
        //   // el
        //   //   .style('fill', 'yellow');
        //   return 'yellow';
        // } 
        // return 'yellow';
        // else {
        //   return '#ff0099';
        //   // let el = d3.select(b[a])
        //   // el
        //   //   .style('fill', '#ff0099');
        // }
      // });
      */

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
