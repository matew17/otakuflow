/**
 * Component tests for SearchInput.vue
 *
 * PRD criterion → test mapping:
 *   AC5  — search input is rendered and accepts v-model
 *   AC8  — submitting the form (Enter key) does NOT trigger navigation/reload
 *          (the <form> uses @submit.prevent, so submit event is cancelled)
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchInput from '../../components/SearchInput.vue'

// ---------------------------------------------------------------------------
// AC5 — SearchInput renders and binds model
// ---------------------------------------------------------------------------

describe('SearchInput — AC5: renders search input', () => {
  it('renders an <input> element', () => {
    const wrapper = mount(SearchInput)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('input has type="search"', () => {
    const wrapper = mount(SearchInput)
    expect(wrapper.find('input').attributes('type')).toBe('search')
  })

  it('reflects the modelValue via v-model', async () => {
    const wrapper = mount(SearchInput, {
      props: {
        modelValue: 'naruto',
        'onUpdate:modelValue': (val: string) => wrapper.setProps({ modelValue: val }),
      },
    })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('naruto')
  })

  it('emits update:modelValue when user types', async () => {
    const wrapper = mount(SearchInput, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (val: string) => wrapper.setProps({ modelValue: val }),
      },
    })
    await wrapper.find('input').setValue('one piece')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual(['one piece'])
  })

  it('renders placeholder text when provided', () => {
    const wrapper = mount(SearchInput, { props: { placeholder: 'Search by Anime Name' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search by Anime Name')
  })
})

// ---------------------------------------------------------------------------
// AC8 — Enter key does NOT cause navigation/reload
// ---------------------------------------------------------------------------

describe('SearchInput — AC8: Enter key does not trigger navigation or form submit', () => {
  it('form element uses @submit.prevent (no default submit behaviour)', async () => {
    const wrapper = mount(SearchInput)
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)

    // Spy on the native form submit to verify it is not called
    const submitHandler = vi.fn()
    form.element.addEventListener('submit', submitHandler)

    // Trigger keydown Enter on the input — this would normally submit the form
    await wrapper.find('input').trigger('keydown', { key: 'Enter', keyCode: 13 })
    // Also fire a synthetic submit event on the form to confirm .prevent is wired
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    form.element.dispatchEvent(submitEvent)

    // The event should have been cancelled by @submit.prevent
    expect(submitEvent.defaultPrevented).toBe(true)
  })

  it('does not navigate when Enter is pressed inside the input', async () => {
    const originalPushState = window.history.pushState.bind(window.history)
    const pushStateSpy = vi.spyOn(window.history, 'pushState')

    const wrapper = mount(SearchInput, {
      props: {
        modelValue: 'naruto',
        'onUpdate:modelValue': (val: string) => wrapper.setProps({ modelValue: val }),
      },
    })
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    // No pushState call means no navigation happened
    expect(pushStateSpy).not.toHaveBeenCalled()
    pushStateSpy.mockRestore()
    void originalPushState
  })
})
