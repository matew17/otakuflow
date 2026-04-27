/**
 * Unit tests for PageTitle.vue
 *
 * PRD criterion → test mapping:
 *   AC11 — accepts `title` prop and renders it inside an <h1>
 *   AC12 — h1 has class `text-center`
 *   AC13 — h1 has class `text-4xl` and `font-bold`
 *   AC14 — h1 has class `py-6` and `mb-6`
 *   AC15 — h1 has class `text-white`
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageTitle from '../../components/PageTitle.vue'

describe('PageTitle — AC11: renders the title prop', () => {
  it('renders the provided title text inside an h1', () => {
    const wrapper = mount(PageTitle, { props: { title: 'Explore' } })
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Explore')
  })

  it('reflects a different title string when prop changes', async () => {
    const wrapper = mount(PageTitle, { props: { title: 'Library' } })
    await wrapper.setProps({ title: 'Favorites' })
    expect(wrapper.find('h1').text()).toBe('Favorites')
  })
})

describe('PageTitle — AC12: horizontal centering class', () => {
  it('h1 has class text-center', () => {
    const wrapper = mount(PageTitle, { props: { title: 'Test' } })
    expect(wrapper.find('h1').classes()).toContain('text-center')
  })
})

describe('PageTitle — AC13: typography classes', () => {
  it('h1 has class text-4xl', () => {
    const wrapper = mount(PageTitle, { props: { title: 'Test' } })
    expect(wrapper.find('h1').classes()).toContain('text-4xl')
  })

  it('h1 has class font-bold', () => {
    const wrapper = mount(PageTitle, { props: { title: 'Test' } })
    expect(wrapper.find('h1').classes()).toContain('font-bold')
  })
})

describe('PageTitle — AC14: spacing classes', () => {
  it('h1 has class py-6', () => {
    const wrapper = mount(PageTitle, { props: { title: 'Test' } })
    expect(wrapper.find('h1').classes()).toContain('py-6')
  })

  it('h1 has class mb-6', () => {
    const wrapper = mount(PageTitle, { props: { title: 'Test' } })
    expect(wrapper.find('h1').classes()).toContain('mb-6')
  })
})

describe('PageTitle — AC15: text color class', () => {
  it('h1 has class text-white', () => {
    const wrapper = mount(PageTitle, { props: { title: 'Test' } })
    expect(wrapper.find('h1').classes()).toContain('text-white')
  })
})
