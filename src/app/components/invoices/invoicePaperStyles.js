export const invoicePaperStyles = {
  container: {
    padding: '20px',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flexStart',
    width: '830px',
    boxShadow: 'var(--morphShadow)'
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  headerImg: {
    width: 50,
    height: 50,
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
    fontSize: 22,
    color: 'var(--darkGrayText)',
  },
  headerLeftH5: {
    fontSize: 12,
    color: 'var(--grayText)',
    fontWeight: 600,
  },
  headerLeftH5Span: {
    fontWeight: 800,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerRightH3: {
    fontSize: 26,
    marginBottom: 5,
    color: 'var(--grayText)',
  },
  billtoSection: {
    width: '100%',
    padding: 20,
    background: 'var(--bg)',
    marginTop: 40,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 30,
    flexWrap: 'wrap',
  },
  billtoSectionH4: {
    fontSize: 17,
    color: 'var(--darkGrayText)',
    marginBottom: 10,
  },
  billtoSectionH5: {
    fontSize: 13,
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
  appTableHeader: {
    borderBottom: '2px solid var(--inputBorderColor)',
    paddingBottom: 10,
  },
  invoiceItemRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    gap: 10,
    borderBottom: '1px solid var(--inputBorderColor)',
  },
  invoiceItemRowH6: {
    flexBasis: '25%',
    fontSize: 12,
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
  totalsSectionH6: {
    fontSize: 13,
    color: 'var(--grayText)',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  totalsSectionH6Totals: {
    fontSize: 16,
    color: 'var(--darkGrayText)',
  },
  notesSection: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 40,
  },
  notesSectionH4: {
    fontSize: 16,
    color: 'var(--darkGrayText)',
    marginBottom: 10,
  },
  notesSectionP: {
    fontSize: 13,
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
    fontSize: 13,
    color: 'var(--grayText)',
    fontWeight: 600,
  },
  footNotesSmall: {
    fontSize: 11,
    color: '#777',
  },
  footNotesLink: {
    color: 'var(--primary)',
    textDecoration: 'underline',
  }
}