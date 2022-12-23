import {
  Document, Image, Link, Page, StyleSheet,
  Text, View, Font
} from "@react-pdf/renderer"
import { convertClassicDate } from "app/utils/dateUtils"
import { formatCurrency, formatPhoneNumber } from "app/utils/generalUtils"
import React from 'react'

export default function EstimatePaperDoc(props) {

  const { estimate, myBusiness, taxNumbers, estimateItems,
    calculatedSubtotal, calculatedTaxRate, calculatedTotal,
    myUser, estSettings } = props
  const myTaxNumbers = taxNumbers || myUser?.taxNumbers

  const headersArr = [
    'Item #',
    'Service',
    'Price',
    'Quantity',
    'Tax Rate',
    'Total'
  ]

  const headersList = headersArr?.map((header, index) => {
    return <Text
      style={styles.tableHeaderH6}
      key={index}
    >
      {header}
    </Text>
  })

  const itemsList = estimateItems?.map((item, index) => {
    return <View
      style={index === estimateItems.length - 1 ? styles.invoiceItemRowLast : styles.invoiceItemRow}
      key={index}
    >
      <Text style={styles.invoiceItemRowH6}>{(index + 1)}</Text>
      <Text style={styles.invoiceItemRowH6}>{item?.name}</Text>
      <Text style={styles.invoiceItemRowH6}>{estimate?.currency.symbol}{formatCurrency(item?.price?.toFixed(2))}</Text>
      <Text style={styles.invoiceItemRowH6}>{item?.quantity}</Text>
      <Text style={styles.invoiceItemRowH6}>{item?.taxRate}%</Text>
      <Text style={styles.invoiceItemRowH6}>{estimate?.currency.symbol}{item?.total?.toFixed(2)}</Text>
    </View>
  })

  const taxNumbersList = myTaxNumbers?.map((taxNum, index) => {
    return <Text
      style={styles.headerH5}
      key={index}
    >
      {taxNum.name}: {taxNum.number}
    </Text>
  })

  return (
    estSettings &&
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={styles.container}
        >
          <View style={styles.header}>
            {
              estSettings.showMyLogo &&
              <Image
                style={styles.headerImg}
                src={estimate?.myBusiness?.logo || myBusiness?.logo}
              />
            }
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                {estSettings.showMyName && <Text style={styles.headerLeftH3}>{estimate?.myBusiness?.name || myBusiness?.name}</Text>}
                {estSettings.showMyAddress && <Text style={styles.headerH5}>{estimate?.myBusiness?.address || myBusiness?.address}</Text>}
                {estSettings.showMyPhone && <Text style={styles.headerH5}>{formatPhoneNumber(estimate?.myBusiness?.phone || myBusiness?.phone)}</Text>}
                {estSettings.showMyEmail && <Text style={styles.headerH5}>{estimate?.myBusiness?.email || myBusiness?.email}</Text>}
                <Text style={styles.headerH5}>
                  {estimate?.myBusiness?.city || myBusiness?.city},&nbsp;
                  {estimate?.myBusiness?.region || myBusiness?.region},&nbsp;
                  {estSettings.showMyCountry ? `${estimate?.myBusiness?.country || myBusiness?.country} ` : null}
                  {estimate?.myBusiness?.postcode || myBusiness?.postcode}
                </Text>
                {estSettings.showMyTaxNumbers && taxNumbersList}
              </View>
              <View
                style={styles.headerRight}
              >
                <Text style={styles.headerRightH3}>Estimate</Text>
                <Text style={styles.headerH5}>#{estimate?.estimateNumber}</Text>
                <Text style={styles.headerH5}>Estimate Date: {convertClassicDate(estimate?.dateCreated.toDate())}</Text>
                {
                  estSettings?.showDueDate &&
                  <Text style={styles.headerH5}>
                    Date Due: <Text style={styles.headerH5Span}>{convertClassicDate(estimate?.dateDue.toDate())}</Text>
                  </Text>
                }
              </View>
            </View>
          </View>
          <View style={styles.billToSection}>
            <View>
              <Text style={styles.billtoSectionH4}>Bill To</Text>
              {estSettings.showClientName && <Text style={styles.billtoSectionH5}>{estimate?.estimateTo.name}</Text>}
              {estSettings.showClientAddress && <Text style={styles.billtoSectionH5}>{estimate?.estimateTo.address}</Text>}
              {estSettings.showClientPhone && <Text style={styles.billtoSectionH5}>{formatPhoneNumber(estimate?.estimateTo.phone)}</Text>}
              {estSettings.showClientEmail && <Text style={styles.billtoSectionH5}>{estimate?.estimateTo.email}</Text>}
              <Text style={styles.billtoSectionH5}>
                {estimate?.estimateTo.city}, {estimate?.estimateTo.region},&nbsp;
                {estSettings.showClientCountry && estimate?.estimateTo.country} {estimate?.estimateTo.postcode}
              </Text>
            </View>
            <View />
          </View>
          <View style={styles.itemsSection}>
            <View style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  {headersList}
                </View>
                <View style={styles.tableRows}>
                  {itemsList}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.totalsSection}>
            <View style={[styles.totalsSectionRow, styles.totalsSectionRowFirst]}>
              <Text style={styles.totalsSectionRowText}>Tax Rate</Text>
              <Text style={styles.totalsSectionRowText}>{calculatedTaxRate}%</Text>
            </View>
            <View style={styles.totalsSectionRow}>
              <Text style={styles.totalsSectionRowText}>Subtotal</Text>
              <Text style={styles.totalsSectionRowText}>{estimate?.currency?.symbol}{formatCurrency(calculatedSubtotal)}</Text>
            </View>
            <View style={styles.totalsSectionRow}>
              <Text style={[styles.totalsSectionRowText, styles.totalsSectionRowh4]}>Total</Text>
              <Text style={[styles.totalsSectionRowText, styles.totalsSectionRowh4]}>{estimate?.currency?.symbol}{formatCurrency(calculatedTotal)} {estimate?.currency?.value}</Text>
            </View>
          </View>
          {
            (estimate?.notes?.length > 0 || estSettings?.estimateNotes?.length > 0) && estSettings?.showNotes &&
            <View style={styles.notesSection}>
              <Text style={styles.notesSectionH4}>Notes</Text>
              <Text style={styles.notesSectionP}>{estimate?.notes || estSettings.estimateNotes}</Text>
            </View>
          }
          <View style={styles.footNotes}>
            <Text style={styles.footNotesH6}>{estSettings.thankYouMessage || 'Thank you for your business.'}</Text>
            {
              estSettings.showInvoiceMeTag &&
              <Text style={styles.footNotesSmall}>
                Estimate generated by&nbsp;
                <Link
                  src="https://invoiceme.pro"
                  style={styles.footNotesLink}
                >
                  <Text>Invoice Me</Text>
                </Link>
              </Text>
            }
          </View>
          <View 
            fixed
            style={styles.footer}
          >
            <Text 
              style={styles.pageNumbers} 
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
            />
          </View>
        </View>
      </Page>
    </Document>
  )
}

const addFontSize = 0
const primary = '#178fff'
const morphShadow = '0 0 6px 2px rgba(23, 143, 255, 0.09)'
const darkGrayText = '#3c4160'
const inputBorderColor = '#e4ecfb'

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
  ]
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    width: '100%',
    fontFamily: 'Open Sans',
  },
  container: {
    padding: 20,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    boxShadow: morphShadow
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  headerImg: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerLeftH3: {
    margin: '5px 0',
    fontWeight: 'bold',
    fontSize: 19 + addFontSize,
    color: darkGrayText,
  },
  headerH5: {
    fontSize: 10 + addFontSize,
    color: darkGrayText,
    fontWeight: 600,
    marginBottom: 1
  },
  headerH5Span: {
    fontWeight: 'bold',
    fontSize: 10 + addFontSize,
    color: darkGrayText,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerRightH3: {
    fontSize: 19 + addFontSize,
    fontWeight: 'bold',
    color: darkGrayText,
    margin: '5px 0',
  },
  billToSection: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 30,
    marginTop: 35
  },
  billtoSectionH4: {
    fontSize: 12 + addFontSize,
    color: darkGrayText,
    marginBottom: 10,
    fontWeight: 900
  },
  billtoSectionH5: {
    fontSize: 10 + addFontSize,
    color: darkGrayText,
    fontWeight: 600,
    marginBottom: 1
  },
  itemsSection: {
    marginTop: 40,
    width: '100%',
  },
  tableContainer: {
    width: '100%',
  },
  table: {
    width: '100%',
    padding: '0 10px',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    flexDirection: 'row',
    borderBottom: '1px solid ' + inputBorderColor,
    width: '100%',
  },
  tableHeaderH6: {
    flexBasis: '25%',
    fontSize: 10 + addFontSize,
    color: darkGrayText,
    fontWeight: 600,
  },
  tableRows: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  invoiceItemRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px 0',
    borderBottom: '1px solid ' + inputBorderColor,
  },
  invoiceItemRowLast: {
    borderBottom: 'none',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px 0',
    gap: 10,
  },
  invoiceItemRowH6: {
    flexBasis: '25%',
    fontSize: 10 + addFontSize,
    color: darkGrayText,
    fontWeight: 600,
    marginRight: 10,
  },
  totalsSection: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 5,
    paddingRight: 10,
  },
  totalsSectionRowFirst: {
    borderTop: '1px solid ' + inputBorderColor,
    paddingTop: 10,
  },
  totalsSectionRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5
  },
  totalsSectionRowText: {
    fontSize: 10 + addFontSize,
    color: darkGrayText,
    fontWeight: 600,
  },
  totalsSectionRowh4: {
    fontSize: 12 + addFontSize,
  },  
  notesSection: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 40,
  },
  notesSectionH4: {
    fontSize: 12 + addFontSize,
    color: darkGrayText,
    marginBottom: 10,
    fontWeight: 600
  },
  notesSectionP: {
    fontSize: 9 + addFontSize,
    color: '#444',
    fontWeight: 500,
  },
  footNotes: {
    margin: '40px 0 20px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderTop: '1px solid ' + inputBorderColor,
    paddingTop: 20,
  },
  footNotesH6: {
    fontSize: 11 + addFontSize,
    color: darkGrayText,
    fontWeight: 600,
  },
  footNotesSmall: {
    fontSize: 9 + addFontSize,
    color: '#777',
    marginTop: 10
  },
  footNotesLink: {
    color: primary,
    textDecoration: 'underline',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: -10,
    right: 20,
  },
  pageNumbers: {
    fontSize: 9 + addFontSize,
    color: '#777',
    fontWeight: 500,
  }
})