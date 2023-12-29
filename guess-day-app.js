(function() {
  main = {
    dw: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    fn: {},
    vals: {},
    game: {}
  }
  main.vals.rangeDaysMin = 30
  main.vals.minDate = new Date(new Date().getFullYear() - 1, 0, 1)
  main.vals.maxDate = new Date(new Date().getFullYear() + 1, 11, 31)
  main.fn.date2attrf = function(date) {
    return new Date(date).toISOString().split('T')[0]
  }
  main.fn.decimalStr = function(int) {
    return int < 10 ? '0' + int : int
  }
  main.fn.addDays = function(date, days) {
    return new Date(date * 1 + days * 24 * 36e5)
  }
  main.fn.sec2StrTime = function(time) {
    let val = new Date(time * 1e3)
    let min = val.getMinutes()
    let sec = val.getSeconds()
    function frm(val) {
      return String(val).padStart(2, 0)
    }
    return frm(min) + ':' + frm(sec)
  }
  main.fn.intDay2strDay = function(day) {
    let days = main.dw
    return days[day]
  }
  main.fn.intMonth2strMonth = function(month) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return months[month]
  }
  main.fn.isLeapYear = function(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }
  main.fn.firstDayOfYear = function(year) {
    return new Date(year, 0, 1).getDay()
  }
  main.fn.cleanTimes = function(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  main.fn.diffBetDays = function(da, dz) {
    return Math.floor(Math.abs(dz * 1 - da * 1) / (24e3 * 36e2))
  }
  main.fn.diffBetDaysIpt = function(iptA, iptZ) {
    return main.fn.diffBetDays(main.fn.dateByIpt(iptA), main.fn.dateByIpt(iptZ))
  }
  main.fn.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  main.fn.randomDate = function() {
    let increment = main.fn.randomInt(0, main.fn.diffBetDays(main.vals.minDate, main.vals.maxDate))
    return new Date(main.vals.minDate * 1 + (increment * 24e3 * 36e2))
  }
  main.fn.dateByIpt = function(domInput) {
    return main.fn.cleanTimes(new Date(domInput.valueAsNumber + 24 * 36e5))
  }
  main.game.start = function() {
    if (main.vals.minDate * 1 > main.vals.maxDate * 1) {
      alert('El rango de fechas no es válido')
    } else {
      main.vals.counterAttempsTotal = Number($('#ipt-attemps').value)
      main.vals.counterAttemps = main.vals.counterAttempsTotal
      main.vals.counterAttempsOk = 0
      $('.screen.home').classList.add('moveLeft')
      setTimeout(function() {
        main.game.nextAttemp()
        main.vals.counterClock = 0
        main.vals.clockInterval = setInterval(function() {
          main.vals.counterClock++
          $('#game-clock').innerText = main.fn.sec2StrTime(main.vals.counterClock)
        }, 1e3)
      }, 10)
    }
  }
  main.game.showResults = function() {
    clearInterval(main.vals.clockInterval)
    let totalTime = main.vals.counterClock / main.vals.counterAttempsTotal
    $('[data-result=average] b').innerText = (Math.round(totalTime * 100) / 100) + ' seg.'
    let timeEnd = main.fn.sec2StrTime(main.vals.counterClock)
    $('[data-result=total] b').innerText = timeEnd.replace(':', ' min. ') + ' seg.'
    $('[data-result=att-ok] b').innerText =  main.vals.counterAttempsOk
    $('[data-result=att-fa] b').innerText =  main.vals.counterAttempsTotal -  main.vals.counterAttempsOk
    $('.screen.result').classList.remove('hide-right')
  }
  main.game.nextAttemp = function() {
    if (main.vals.counterAttemps--) {
      let countAttps = {t: main.vals.counterAttempsTotal, a: main.vals.counterAttemps}
      let nDate = main.fn.randomDate()
      let nd = {f: nDate, y: nDate.getFullYear(), m: nDate.getMonth(), d: nDate.getDate(), dw: nDate.getDay()}
      let lastForm = $('.game-form')
      let isFirstAttemp = main.vals.counterAttempsTotal == main.vals.counterAttemps + 1
      let timeWaitForm = isFirstAttemp ? 10 : 800
      if (!isFirstAttemp) {
        lastForm.classList.add('outForm')
      }
      $('.txt-anio').innerText = nd.y
      $('.txt-attemps').innerText = (countAttps.t - countAttps.a) + '/' + countAttps.t
      let infAttemp = {
        date: nd.d + '/' + main.fn.intMonth2strMonth(nd.m).slice(0, 3),
        leap: main.fn.isLeapYear(nd.y) ? 'Sí' : ' No',
        fDay: main.fn.intDay2strDay(main.fn.firstDayOfYear(nd.y))
      }
      let newForm = document.createElement('div')
      newForm.classList.add('game-form')
      newForm.innerHTML = /*html*/`<div class="game-date"><div class="txt-date">${infAttemp['date']}</div></div>
<div class="game-hints">
  <div class="hint hint-leap"><span>Bisiesto:</span><b>${infAttemp['leap']}</b></div>
  <div class="hint hint-frst"><span>Primer día:</span><b>${infAttemp['fDay']}</b></div>
</div><div class="game-options">
  <div class="game-opts-cont"></div>
  <div class="game-opts-result"></div>
</div>`
      let optsCont = newForm.querySelector('.game-opts-cont')
      optsCont.innerHTML = ''
      main.dw.forEach(function(day, idx) {
        let btnDayOpt = document.createElement('div')
        btnDayOpt.classList.add('btn-opt-day')
        btnDayOpt.setAttribute('data-index', idx)
        btnDayOpt.innerText = day
        btnDayOpt.addEventListener('click', function() {
          if (!optsCont.classList.contains('verifying')) {
            optsCont.classList.add('verifying')
            btnDayOpt.classList.add('clicked')
            if (idx == nd.dw) {
              btnDayOpt.classList.add('good')
              main.vals.counterAttempsOk++
            } else {
              btnDayOpt.classList.add('bad')
              let listOpts = optsCont.children
              let listLen = listOpts.length, i = 0
              while (i < listLen) {
                if (listOpts[i].getAttribute('data-index') == nd.dw) {
                  listOpts[i].classList.add('correct')
                }
                i++
              }
            }
            setTimeout(function() {
              main.game.nextAttemp()
            }, 1600)
          }
        })
        optsCont.appendChild(btnDayOpt)
      })
      lastForm.classList.add('outForm')
      setTimeout(function() {
        lastForm.parentNode.insertBefore(newForm, lastForm)
        lastForm.parentNode.removeChild(lastForm)
        newForm.classList.add('inForm')
        setTimeout(function() {
          newForm.classList.remove('inForm')
        }, timeWaitForm)
      }, timeWaitForm)
    } else {
      main.game.showResults()
    }
  }
  main.game.restart = function() {
    location.reload()
  }
  function $(query) {return document.querySelector(query)}
  
  if (1 == 1) {
    let iDa = $('#ipt-date-start'), iDz = $('#ipt-date-end')
    let mf = main.fn, mv = main.vals
    iDa.value = mf.date2attrf(mv.minDate)
    iDz.value = mf.date2attrf(mv.maxDate)
    iDa.max = mf.date2attrf(mf.addDays(mv.maxDate, -mv.rangeDaysMin))
    iDz.min = mf.date2attrf(mf.addDays(mv.minDate, mv.rangeDaysMin))
    iDa.addEventListener('input', function() {
      if (isNaN(iDa.valueAsNumber)) {
        iDa.value = mf.date2attrf(mv.minDate)
      } else {
        if (mf.diffBetDaysIpt(iDa, iDz) < mv.rangeDaysMin) {
          alert('El rango de días no puede ser inferior a ' + mv.rangeDaysMin)
          iDa.value = mf.date2attrf(mf.addDays(mf.dateByIpt(iDz), -mv.rangeDaysMin))
        } else {
          mv.minDate = mf.dateByIpt(iDa)
          iDz.min = mf.date2attrf(mf.addDays(mv.minDate, mv.rangeDaysMin))
        }
      }
    })
    iDz.addEventListener('input', function() {
      if (isNaN(iDz.valueAsNumber)) {
        iDz.value = mf.date2attrf(mv.maxDate)
      } else {
        if (mf.diffBetDaysIpt(iDa, iDz) < mv.rangeDaysMin) {
          alert('El rango de días no puede ser inferior a ' + mv.rangeDaysMin)
          iDz.value = mf.date2attrf(mf.addDays(mf.dateByIpt(iDa), mv.rangeDaysMin))
        } else {
          mv.maxDate = mf.dateByIpt(iDz)
          iDa.max = mf.date2attrf(mf.addDays(mv.maxDate, -mv.rangeDaysMin))
        }
      }
    })
  }
  $('#start').addEventListener('click', main.game.start)
  $('#game-exit').addEventListener('click', main.game.restart)
  $('#game-restart').addEventListener('click', main.game.restart)
  // window.ggd = main
})()