<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <section class="document-sheet document-cover">
      <div class="document-page-frame">
        <div class="document-cover-content">
          <ck-children/>
        </div>
      </div>
    </section>
  </xsl:template>
</xsl:stylesheet>
