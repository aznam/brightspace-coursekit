<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <div class="document-cover-title-block">
      <xsl:if test="/*/@kicker!=''">
        <div class="document-cover-kicker">
          <xsl:value-of select="/*/@kicker"/>
        </div>
      </xsl:if>
      <h1 class="document-cover-title">
        <xsl:value-of select="/*/@title"/>
      </h1>
      <xsl:if test="/*/@subtitle!=''">
        <div class="document-cover-subtitle">
          <xsl:value-of select="/*/@subtitle"/>
        </div>
      </xsl:if>
    </div>
  </xsl:template>
</xsl:stylesheet>
