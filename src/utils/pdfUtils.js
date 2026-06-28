import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

export async function loadPdfTemplate(templateUrl) {
  const response = await fetch(templateUrl)
  const arrayBuffer = await response.arrayBuffer()
  return arrayBuffer
}

export async function fillPdfTemplate(templateBytes, formData, fontUrl) {
  const pdfDoc = await PDFDocument.load(templateBytes)
  pdfDoc.registerFontkit(fontkit)

  let customFont = null
  if (fontUrl) {
    try {
      const fontResponse = await fetch(fontUrl)
      const fontBytes = await fontResponse.arrayBuffer()
      customFont = await pdfDoc.embedFont(fontBytes, { subset: true })
    } catch {
      customFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    }
  } else {
    customFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  }

  try {
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    fields.forEach((field) => {
      const fieldName = field.getName()
      if (formData[fieldName] !== undefined) {
        try {
          const textField = form.getTextField(fieldName)
          textField.setText(String(formData[fieldName]))
          if (customFont) {
            textField.updateAppearances(customFont)
          }
        } catch {
          try {
            const checkBox = form.getCheckBox(fieldName)
            if (formData[fieldName]) {
              checkBox.check()
            } else {
              checkBox.uncheck()
            }
          } catch {
            // skip unsupported field types
          }
        }
      }
    })

    form.flatten()
  } catch {
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { height } = firstPage.getSize()

    let yOffset = height - 60
    const fontSize = 12
    const lineHeight = 20

    Object.entries(formData).forEach(([key, value]) => {
      if (value && yOffset > 40) {
        firstPage.drawText(`${key}: ${value}`, {
          x: 50,
          y: yOffset,
          size: fontSize,
          font: customFont,
          color: rgb(0, 0, 0),
        })
        yOffset -= lineHeight
      }
    })
  }

  return await pdfDoc.save()
}

export function createBlobUrl(pdfBytes) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}

export function downloadPdf(pdfBytes, filename = 'document.pdf') {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function createBlankPdf(formData, fontUrl) {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  let customFont
  if (fontUrl) {
    try {
      const fontResponse = await fetch(fontUrl)
      const fontBytes = await fontResponse.arrayBuffer()
      customFont = await pdfDoc.embedFont(fontBytes, { subset: true })
    } catch {
      customFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    }
  } else {
    customFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  }

  const page = pdfDoc.addPage([595.28, 841.89])
  const { height } = page.getSize()

  let yPos = height - 60
  const titleSize = 18
  const labelSize = 11
  const valueSize = 13
  const lineHeight = 24

  if (formData.documentTitle) {
    page.drawText(formData.documentTitle, {
      x: 50,
      y: yPos,
      size: titleSize,
      font: customFont,
      color: rgb(0.1, 0.1, 0.3),
    })
    yPos -= 40
  }

  page.drawLine({
    start: { x: 50, y: yPos },
    end: { x: 545, y: yPos },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.8),
  })
  yPos -= 30

  const entries = Object.entries(formData).filter(([key]) => key !== 'documentTitle')

  entries.forEach(([key, value]) => {
    if (value && yPos > 60) {
      page.drawText(key, {
        x: 50,
        y: yPos,
        size: labelSize,
        font: customFont,
        color: rgb(0.4, 0.4, 0.5),
      })
      yPos -= lineHeight - 4

      const lines = String(value).split('\n')
      lines.forEach((line) => {
        if (yPos > 40) {
          page.drawText(line, {
            x: 50,
            y: yPos,
            size: valueSize,
            font: customFont,
            color: rgb(0, 0, 0),
          })
          yPos -= lineHeight
        }
      })
      yPos -= 10
    }
  })

  return await pdfDoc.save()
}
