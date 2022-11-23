const addFontSize = 8

export const invoicePaperStyles = {
  container: {
    padding: '40px 50px',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flexStart',
    width: '100%',
    boxShadow: 'var(--morphShadow)'
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  headerImg: {
    width: 100,
    height: 100,
    objectFit: 'contain',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerLeftH3: {
    margin: '5px 0',
    marginTop: 10,
    fontSize: 22+addFontSize,
    color: 'var(--darkGrayText)',
  },
  headerH5: {
    fontSize: 13+addFontSize,
    color: 'var(--grayText)',
    fontWeight: 600,
  },
  headerH5Span: {
    fontWeight: 800,
    fontSize: 13+addFontSize,
    color: 'var(--grayText)',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerRightH3: {
    fontSize: 26+addFontSize,
    marginBottom: addFontSize,
    color: 'var(--grayText)',
  },
  billToSection: {
    width: '100%',
    padding: '30px 20px',
    backgroundColor: 'var(--bg)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 30,
    flexWrap: 'wrap',
    marginTop: 40
  },
  billtoSectionH4: {
    fontSize: 17+addFontSize,
    color: 'var(--darkGrayText)',
    marginBottom: 10,
  },
  billtoSectionH5: {
    fontSize: 13+addFontSize,
    color: 'var(--darkGrayText)',
    fontWeight: 500,
  },
  itemsSection: {
    marginTop: 50,
    width: '100%',
  },
  appTable: {
    minWidth: '100%',
  },
  appTableHeaders: {
    borderBottom: '2px solid var(--inputBorderColor)',
    paddingBottom: 10,
  },
  appTableHeadersH5: {
    fontSize: 13+addFontSize,
  },
  invoiceItemRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    gap: 10,
    borderBottom: '1px solid var(--inputBorderColor)',
  },
  invoiceItemRowLast: {
    borderBottom: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    gap: 10,
  },
  invoiceItemRowH6: {
    flexBasis: '25%',
    fontSize: 12+addFontSize,
    color: 'var(--darkGrayText)',
    fontWeight: 600,
  },
  invoiceItemRowActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    flexBasis: '25%',
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
  totalsSectionH6First: {
    borderTop: '1px solid var(--inputBorderColor)',
    fontSize: 13+addFontSize,
    color: 'var(--grayText)',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
    paddingTop: 20
  },
  totalsSectionH6: {
    fontSize: 13+addFontSize,
    color: 'var(--grayText)',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  totalsSectionH6Totals: {
    fontSize: 16+addFontSize,
    color: 'var(--darkGrayText)',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  notesSection: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 40,
  },
  notesSectionH4: {
    fontSize: 16+addFontSize,
    color: 'var(--darkGrayText)',
    marginBottom: 10,
  },
  notesSectionP: {
    fontSize: 13+addFontSize,
    color: '#777',
    fontWeight: 500,
  },
  footNotes: {
    margin: '40px 0 20px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderTop: '1px solid var(--inputBorderColor)',
    paddingTop: 20,
  },
  footNotesH6: {
    fontSize: 13+addFontSize,
    color: 'var(--grayText)',
    fontWeight: 600,
  },
  footNotesSmall: {
    fontSize: 11+addFontSize,
    color: '#777',
  },
  footNotesLink: {
    // fontSize: 11+addFontSize,
    color: 'var(--primary)',
    textDecoration: 'underline',
  }
}