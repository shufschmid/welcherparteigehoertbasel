// import { v4 as uuidv4 } from 'uuid'
export const state = () => ({
  fetched: false,
  total: 0,
  showLegend: false,
  mapFilters: [],
  mapLegend: [],
  mapSection: [],
  mapColors: {},
  mapData: [],
  mapDataMirror: null,
})

export const mutations = {
  addFile(state, file) {
    // .log(file[0].name)
    state.uploads.push({
      id: state.uploads.length + 1,
      file,
    })
    // console.log(state.uploads)
  },
  addFilters(state, filters) {
    const keys = Object.keys(...filters)
    filters.forEach((x) => {
      if (!state.mapLegend.includes(x[keys[0]])) {
        state.mapLegend.push(x[keys[0]])
        state.mapSection.push([keys[0]])
        state.mapColors[x[keys[0]]] = x[keys[1]]
      }
    })
    state.mapFilters.push(filters)
  },
  filterMap(state, file) {
    if (!localStorage.getItem(file.id || 'defaultMap')) {
      localStorage.setItem(
        file.id || 'defaultMap',
        JSON.stringify(state.mapData)
      )
    } else {
      // console.log(localStorage.getItem(file.id))
      state.mapData = JSON.parse(localStorage.getItem(file.id || 'defaultMap'))
    }
    if (typeof file.val === 'string') {
      state.mapData[0].features = state.mapData[0].features.filter(
        (e) => e.properties[file.key] === file.val
      )
    } else if (!!file.val && file.val.length > 0) {
      // console.log(file.val)
      state.mapData[0].features = state.mapData[0].features.filter((e) =>
        file.val.includes(e.properties[file.key])
      )
    } else if (file.id) {
      localStorage.getItem(file.id)
      state.mapData = JSON.parse(localStorage.getItem(file.id || 'defaultMap'))
    }
  },
  revertMap(state) {
    state.mapData = state.mapDataMirror
  },
  toggleLegend(state) {
    state.showLegend = !state.showLegend
  },
  setFetched(state, status = true) {
    state.fetched = status
  },
  addMapData(state, item, filter = null) {
    if (!item && !item.data) {
      return
    }
    // console.log(item)
    // console.log(state.mapData)
    state.mapData = []
    const forFilter = []
    const obj = {
      type: 'FeatureCollection',
      features: [],
    }
    for (let i = 0; i < item.data.length; i++) {
      // item.data[i].show = true
      // item.data[i].uid = uuidv4()
      obj.features.push({
        type: 'Feature',
        properties: {
          ...item.data[i],
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: [JSON.parse(item.data[i].json)],
        },
      })
      forFilter.push(
        delete item.data[i].json && {
          ...item.data[i],
        }
      )
    }
    state.mapData.push(obj)
    this.dispatch('getFilters', forFilter)
  },
  addTotal(state, item) {
    state.total = item
  },
  addActive(state, item) {
    state.active.egrid = item.egrid
  },
  addComment(state, item) {
    state.active.check = item.check || false
    state.active.comment = item.comment || null
  },
  addUploadState(state, item) {
    state.active.upload = item
  },
}
export const actions = {
  fetchMap({ commit }, payload) {
    const url = `${
      process.env.NODE_ENV === 'production' ? '' : process.env.BASE_URL
    }.netlify/functions/map${
      payload.filter ? '?filter=' + payload.filter : ''
    }${payload.id ? (payload.filter ? '&' : '?') + 'id=' + payload.id : ''}`
    this.$axios.get(url).then((res) => {
      commit('addMapData', res)
      commit('addTotal', res.data.length)
    })
  },
  getFilters({ commit }, files) {
    // find matrix
    if (!files || files.length === 0) return
    // const filters = {}
    // const stObj = {}
    commit('addFilters', files)
    // files.forEach((i) => {
    //   const cats = Object.keys(files).filter(
    //     (y) => y.includes('kat:') && parseInt(files[y]) === 1
    //   )
    //   console.log(cats, i)
    //   // find matrix non kat: values
    //   const nonCats = Object.keys(files).filter(
    //     (y) => !y.includes('kat:') && !y.startsWith('_') && !y.includes('json')
    //   )
    //   nonCats.forEach((m) => {
    //     Object.assign(filters, { [m]: files[m], ...filters })
    //   })
    //   // threat matrix
    //   cats.forEach((f) => {
    //     const fin = f.replace(/kat:/gi, '').split(':')
    //     fin.forEach(() => {
    //       Object.assign(stObj, {
    //         // Owner aka Eigentümer from table header
    //         [fin[0]]: fin[1],
    //         styles: {
    //           color: fin[2],
    //         },
    //         ...stObj,
    //       })
    //     })
    //     console.log(stObj, 'ffgfhgf')
    //   })
    // })
  },
}
