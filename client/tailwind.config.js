module.exports = {
  mode: "jit",
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html', './src/components/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        indigoDD: '#3c1dfe',
        aquaDD: '#2bfae1',
        magentaDD: '#ff6ce1',
        yellowDD: '#ffec86',
        gray1: '#fafafa',
        gray2: '#f2f2f2',
        gray3: '#dedede',
        gray4: '#a4a4a4',
        popupOverlay: 'rgba(0, 0, 0, 0.40)',
        popupOverlay2: 'rgba(0, 0, 0, 0.20)',
        popupOverlay3: 'rgba(191, 191, 191, 0.40)',
        headerColor: 'rgba(253, 192, 254, 0.3)',
        footerColor: '#FFF3FF',
      },
      fontFamily: {
        ob: ['Obviously Demo', 'Arial', 'sans-serif'],
        obWide: ['Obviously Demo Wide', 'Arial', 'sans-serif'],
        obExtd: ['Obviously Demo Extended', 'Arial', 'sans-serif'],
        ibm: ['IBM Plex Mono', 'monospace'],
      },
      screens: {
        'xs': '400px',
        '600px': '600px',
        '700px': '700px',
        '800px': '800px',
        '1000px': '1000px',
        '1200px': '1200px',
        '1860px': '1860px',
        '1600px': '1600px',
        '1800px': '1800px',
      },
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}
