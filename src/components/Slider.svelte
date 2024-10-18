<script lang="ts">
  export let label: string;
  export let min: number;
  export let max: number;
  export let step: number;
  export let value: number;
  export let onChange: (newValue: number) => void;

  function handleChange(event: Event) {
    const newValue = parseFloat((event.target as HTMLInputElement).value);
    onChange(newValue);
  }
</script>

<div class="slider-container">
  <label>
    {label}
    <input
      type="range"
      {min}
      {max}
      {step}
      {value}
      on:input={handleChange}
    />
    <span class="slider-value">{value}</span>
  </label>
</div>

<style>
  .slider-container {
    margin-bottom: 20px;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  input[type="range"] {
    width: 60%;
    margin: 0 10px;
  }

  .slider-value {
    min-width: 30px;
    text-align: right;
  }
</style>

