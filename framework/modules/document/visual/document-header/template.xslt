<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <header class="document-header">
      <div class="document-header-brand">
        <xsl:if test="/*/@logo!=''">
          <img class="document-header-logo" src="{/*/@logo}" alt="Institution logo"/>
        </xsl:if>
        <div class="document-header-course">
          <strong>
            <xsl:value-of select="/*/@code"/>
            <xsl:if test="/*/@course!=''"> · <xsl:value-of select="/*/@course"/></xsl:if>
          </strong>
        </div>
      </div>
      <div class="document-header-meta">
        <xsl:if test="/*/@section!=''">Section <xsl:value-of select="/*/@section"/></xsl:if>
      </div>
    </header>
  </xsl:template>
</xsl:stylesheet>
