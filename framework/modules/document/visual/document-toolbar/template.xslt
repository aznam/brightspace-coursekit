<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <div class="document-screen-toolbar">
      <span class="document-screen-note">For clean printing, disable browser <strong>Headers and footers</strong>.</span>
      <button type="button" class="document-print">Print document</button>
    </div>
  </xsl:template>
</xsl:stylesheet>
