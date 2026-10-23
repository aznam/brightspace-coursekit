<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <figure class="document-figure">
      <xsl:if test="/*/@src!=''">
        <img src="{/*/@src}" alt="{/*/@alt}"/>
      </xsl:if>
      <xsl:if test="/*/@caption!=''">
        <figcaption>
          <xsl:value-of select="/*/@caption"/>
        </figcaption>
      </xsl:if>
    </figure>
  </xsl:template>
</xsl:stylesheet>
