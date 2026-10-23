<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <section class="document-section">
      <xsl:if test="/*/@title!=''">
        <h1 class="document-section-title">
          <xsl:value-of select="/*/@title"/>
        </h1>
      </xsl:if>
      <div class="document-section-content">
        <ck-children/>
      </div>
    </section>
  </xsl:template>
</xsl:stylesheet>
