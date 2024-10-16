<script>
    export let progress = 0;
  </script>
  
  <div class="speed-reader-progress" style="width: {progress}%"></div>
  
  <style>
    .speed-reader-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: width 0.1s linear;
    }
  </style>