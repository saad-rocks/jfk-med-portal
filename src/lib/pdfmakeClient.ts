import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

const pdfMakeInstance = (pdfMake as any).default || pdfMake;
const fontsModule: any = pdfFonts;
const vfs =
  fontsModule?.pdfMake?.vfs ??
  fontsModule?.vfs ??
  fontsModule?.default?.vfs ??
  fontsModule?.default?.pdfMake?.vfs ??
  fontsModule;

if (!vfs || typeof vfs !== 'object') {
  console.warn('[pdfmake] Failed to load virtual fonts; PDF downloads may not work.');
} else {
  pdfMakeInstance.vfs = vfs;
  if (!pdfMakeInstance.fonts) {
    pdfMakeInstance.fonts = {};
  }
  pdfMakeInstance.fonts = {
    ...pdfMakeInstance.fonts,
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  };
}

export default pdfMakeInstance as any;
