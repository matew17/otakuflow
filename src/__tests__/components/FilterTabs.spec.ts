/**
 * Component tests for FilterTabs.vue
 *
 * PRD criterion → test mapping:
 *   AC1  — displays "Top Anime" and "This Season" tabs
 *   AC1  — active tab has classes bg-primary and text-white
 *   AC1  — inactive tab has class bg-surface
 *   AC3  — clicking a tab emits update:modelValue with the correct FilterValue
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterTabs from '../../components/FilterTabs.vue'

// ---------------------------------------------------------------------------
// AC1 — Tab UI rendering
// ---------------------------------------------------------------------------

describe('FilterTabs — AC1: renders two tabs with correct labels', () => {
  it('renders a "Top Anime" button', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const buttons = wrapper.findAll('button')
    expect(buttons.some((b) => b.text() === 'Top Anime')).toBe(true)
  })

  it('renders a "This Season" button', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const buttons = wrapper.findAll('button')
    expect(buttons.some((b) => b.text() === 'This Season')).toBe(true)
  })

  it('renders exactly two tab buttons', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    expect(wrapper.findAll('button')).toHaveLength(2)
  })
})

describe('FilterTabs — AC1: active tab styling', () => {
  it('active tab (top) has bg-primary class', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    expect(topButton.classes()).toContain('bg-primary')
  })

  it('active tab (top) has text-white class', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    expect(topButton.classes()).toContain('text-white')
  })

  it('active tab (season) has bg-primary class', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'season' } })
    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    expect(seasonButton.classes()).toContain('bg-primary')
  })

  it('active tab (season) has text-white class', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'season' } })
    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    expect(seasonButton.classes()).toContain('text-white')
  })
})

describe('FilterTabs — AC1: inactive tab styling', () => {
  it('inactive tab has bg-surface class when active is top', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    expect(seasonButton.classes()).toContain('bg-surface')
  })

  it('inactive tab does NOT have bg-primary class when not active', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    expect(seasonButton.classes()).not.toContain('bg-primary')
  })

  it('inactive tab has bg-surface class when active is season', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'season' } })
    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    expect(topButton.classes()).toContain('bg-surface')
  })
})

// ---------------------------------------------------------------------------
// AC3 — Tab switching emits correct event
// ---------------------------------------------------------------------------

describe('FilterTabs — AC3: clicking a tab emits update:modelValue', () => {
  it('clicking "This Season" emits update:modelValue with "season"', async () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    await seasonButton.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['season'])
  })

  it('clicking "Top Anime" emits update:modelValue with "top"', async () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'season' } })
    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    await topButton.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['top'])
  })

  it('clicking the already-active tab still emits update:modelValue', async () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    await topButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// AC2 — Default tab appearance (modelValue='top' is the component's default expectation)
// ---------------------------------------------------------------------------

describe('FilterTabs — AC2: "Top Anime" is visually active when modelValue is "top"', () => {
  it('Top Anime tab is styled as active when modelValue="top"', () => {
    const wrapper = mount(FilterTabs, { props: { modelValue: 'top' } })
    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    expect(topButton.classes()).toContain('bg-primary')
  })
})
