<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <footer class="document-footer">
      <div class="document-footer-left">
        <xsl:if test="/*/@program!=''">
          <div class="document-footer-program">
            <xsl:value-of select="/*/@program"/>
          </div>
        </xsl:if>
        <xsl:if test="/*/@text!=''">
          <div class="document-footer-custom">
            <xsl:value-of select="/*/@text"/>
          </div>
        </xsl:if>
      </div>
      <div class="document-footer-center">
        <xsl:value-of select="/*/@term"/>
        <xsl:if test="/*/@year!=''"> · <xsl:value-of select="/*/@year"/></xsl:if>
      </div>
      <div class="document-footer-page"/>
    </footer>
  </xsl:template>
</xsl:stylesheet>
