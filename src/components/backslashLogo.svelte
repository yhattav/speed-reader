<script>
    export let isExpanded = false;
    export let offsetColor = '255, 69, 0'; // Default to orange-red
    export let position = 'left'; // 'left' or 'right'
</script>

<svg width="100%" height="100%" viewBox="0 0 30 30">
    <path
        d="M5 5 L25 25"
        stroke="rgb({offsetColor})"
        stroke-width="2"
        fill="none"
        transform="
            rotate({position === 'right' ? 180 : 0}, 15, 15)
            scale({isExpanded ? '1 1.6' : '1 1'})
        "
    />
</svg>

<style>
    svg {
        transition: all 0.3s ease;
    }
    path {
        transition: transform 0.3s ease;
    }
</style>
